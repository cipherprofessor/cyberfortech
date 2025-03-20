// src/app/api/training/enrollments/[enrollmentId]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface EnrollmentUpdateBody {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  paymentAmount?: number;
  feedback?: string;
  rating?: number;
  completionDate?: string;
  certificateId?: string;
}

// GET a specific enrollment by ID
export async function GET(
  request: Request,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { enrollmentId } = params;
    
    const result = await client.execute({
      sql: `
        SELECT 
          e.id,
          e.course_id as courseId,
          e.user_id as userId,
          e.status,
          e.payment_status as paymentStatus,
          e.payment_id as paymentId,
          e.payment_amount as paymentAmount,
          e.enrollment_date as enrollmentDate,
          e.completion_date as completionDate,
          e.feedback,
          e.rating,
          e.certificate_id as certificateId,
          e.created_at as createdAt,
          e.updated_at as updatedAt,
          c.title as courseTitle,
          c.dates as courseDates,
          c.time as courseTime,
          c.instructor as courseInstructor,
          u.first_name as firstName,
          u.last_name as lastName,
          u.full_name as fullName,
          u.email,
          u.avatar_url as avatarUrl
        FROM training_enrollments e
        JOIN training_courses c ON e.course_id = c.id
        JOIN users u ON e.user_id = u.id
        WHERE e.id = ? AND e.is_deleted = FALSE
      `,
      args: [enrollmentId]
    });
    
    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to view this enrollment
    // Admin can view any enrollment, regular users can only view their own
    const enrollment = result.rows[0];
    if (user.id !== enrollment.userId && !user.roles?.includes(ROLES.ADMIN)) {
      return NextResponse.json(
        { error: 'Unauthorized to access this enrollment' },
        { status: 403 }
      );
    }
    
    // Format numeric values
    enrollment.paymentAmount = enrollment.paymentAmount ? Number(enrollment.paymentAmount) : null;
    enrollment.rating = enrollment.rating ? Number(enrollment.rating) : null;
    
    return NextResponse.json(enrollment);
    
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment' },
      { status: 500 }
    );
  }
}

// UPDATE an enrollment
export async function PUT(
  request: Request,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { enrollmentId } = params;
    const body = await request.json() as EnrollmentUpdateBody;
    
    // Check if enrollment exists
    const enrollmentResult = await client.execute({
      sql: `
        SELECT e.id, e.user_id as userId, e.status
        FROM training_enrollments e
        WHERE e.id = ? AND e.is_deleted = FALSE
      `,
      args: [enrollmentId]
    });
    
    if (!enrollmentResult.rows.length) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    const enrollment = enrollmentResult.rows[0];
    
    // Check if the user is authorized to update this enrollment
    // Admin can update any enrollment, regular users can only update specific fields of their own enrollments
    const isAdmin = user.roles?.includes(ROLES.ADMIN);
    const isOwner = user.id === enrollment.userId;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized to update this enrollment' },
        { status: 403 }
      );
    }
    
    // Regular users can only provide feedback and rating
    if (!isAdmin && (
      body.status !== undefined || 
      body.paymentStatus !== undefined ||
      body.paymentId !== undefined ||
      body.paymentAmount !== undefined ||
      body.completionDate !== undefined ||
      body.certificateId !== undefined
    )) {
      return NextResponse.json(
        { error: 'Regular users can only update feedback and rating' },
        { status: 403 }
      );
    }
    
    // Validate rating if provided
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Build update SQL
    const updates: string[] = [];
    const queryParams: any[] = [];
    
    // Helper function to add a field to the update
    const addField = (fieldName: string, value: any, dbFieldName?: string) => {
      if (value !== undefined) {
        updates.push(`${dbFieldName || fieldName} = ?`);
        queryParams.push(value);
      }
    };
    
    // Add all possible fields that can be updated
    addField('status', body.status);
    addField('paymentStatus', body.paymentStatus, 'payment_status');
    addField('paymentId', body.paymentId, 'payment_id');
    addField('paymentAmount', body.paymentAmount, 'payment_amount');
    addField('feedback', body.feedback);
    addField('rating', body.rating);
    addField('completionDate', body.completionDate, 'completion_date');
    addField('certificateId', body.certificateId, 'certificate_id');
    
    // Only proceed if there are fields to update
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    // Execute the update
    await client.execute({
      sql: `
        UPDATE training_enrollments
        SET ${updates.join(', ')}
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [...queryParams, enrollmentId]
    });
    
    // Fetch the updated enrollment
    const updatedResult = await client.execute({
      sql: `
        SELECT 
          e.id,
          e.course_id as courseId,
          e.user_id as userId,
          e.status,
          e.payment_status as paymentStatus,
          e.payment_id as paymentId,
          e.payment_amount as paymentAmount,
          e.enrollment_date as enrollmentDate,
          e.completion_date as completionDate,
          e.feedback,
          e.rating,
          e.certificate_id as certificateId,
          e.created_at as createdAt,
          e.updated_at as updatedAt
        FROM training_enrollments e
        WHERE e.id = ? AND e.is_deleted = FALSE
      `,
      args: [enrollmentId]
    });
    
    const updatedEnrollment = updatedResult.rows[0];
    
    // Format numeric values
    updatedEnrollment.paymentAmount = updatedEnrollment.paymentAmount ? Number(updatedEnrollment.paymentAmount) : null;
    updatedEnrollment.rating = updatedEnrollment.rating ? Number(updatedEnrollment.rating) : null;
    
    return NextResponse.json(updatedEnrollment);
    
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}

// DELETE an enrollment (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { enrollmentId } = params;
    
    // Check if enrollment exists
    const enrollmentResult = await client.execute({
      sql: `
        SELECT e.id, e.user_id as userId, e.status, e.course_id as courseId
        FROM training_enrollments e
        WHERE e.id = ? AND e.is_deleted = FALSE
      `,
      args: [enrollmentId]
    });
    
    if (!enrollmentResult.rows.length) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    const enrollment = enrollmentResult.rows[0];
    
    // Check if the user is authorized to delete this enrollment
    // Admin can delete any enrollment, regular users can only cancel their own enrollments
    const isAdmin = user.roles?.includes(ROLES.ADMIN);
    const isOwner = user.id === enrollment.userId;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this enrollment' },
        { status: 403 }
      );
    }
    
    // Start a transaction
    const transaction = await client.transaction();
    
    try {
      // Soft delete the enrollment
      await transaction.execute({
        sql: `
          UPDATE training_enrollments
          SET 
            is_deleted = TRUE,
            status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [enrollmentId]
      });
      
      // If the enrollment was confirmed, decrement the course's enrollment count
      if (enrollment.status === 'confirmed') {
        await transaction.execute({
          sql: `
            UPDATE training_courses
            SET 
              current_enrollment = current_enrollment - 1,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          args: [enrollment.courseId]
        });
      }
      
      // Commit the transaction
      await transaction.commit();
      
      return NextResponse.json({
        message: 'Enrollment cancelled successfully'
      });
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to delete enrollment' },
      { status: 500 }
    );
  }
}