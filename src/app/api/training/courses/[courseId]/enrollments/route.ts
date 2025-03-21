// src/app/api/training/courses/[courseId]/enrollments/route.ts
import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface EnrollmentBody {
  paymentId?: string;
  paymentAmount?: number;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

// POST - Enroll a user in a course
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { courseId } = params;
    const body = await request.json() as EnrollmentBody;
    
    // Start a transaction
    const transaction = await client.transaction();
    
    try {
      // Check if course exists and has space
      const courseResult = await transaction.execute({
        sql: `
          SELECT 
            id, 
            max_capacity as maxCapacity, 
            current_enrollment as currentEnrollment,
            price,
            is_active as isActive
          FROM training_courses 
          WHERE id = ? AND is_deleted = FALSE
        `,
        args: [courseId]
      });
      
      if (!courseResult.rows.length) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
      
      const course = courseResult.rows[0];
      
      // Check if course is active
      if (!course.isActive) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Course is not active for enrollment' },
          { status: 400 }
        );
      }
      
      const maxCapacity = Number(course.maxCapacity);
      const currentEnrollment = Number(course.currentEnrollment);
      
      // Check if course has space
      if (currentEnrollment >= maxCapacity) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Course is at maximum capacity' },
          { status: 400 }
        );
      }
      
      // Check if user is already enrolled
      const existingEnrollment = await transaction.execute({
        sql: `
          SELECT id 
          FROM training_enrollments 
          WHERE course_id = ? AND user_id = ? AND is_deleted = FALSE
        `,
        args: [courseId, user.id]
      });
      
      if (existingEnrollment.rows.length > 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'User is already enrolled in this course' },
          { status: 400 }
        );
      }
      
      // Generate enrollment ID
      const enrollmentId = nanoid();
      
      // Set default payment amount if not provided
      const paymentAmount = body.paymentAmount || Number(course.price);
      
      // Insert the enrollment
      await transaction.execute({
        sql: `
          INSERT INTO training_enrollments (
            id,
            course_id,
            user_id,
            status,
            payment_status,
            payment_id,
            payment_amount,
            enrollment_date,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [
          enrollmentId,
          courseId,
          user.id,
          body.status || 'pending',
          body.paymentStatus || 'pending',
          body.paymentId || null,
          paymentAmount
        ]
      });
      
      // Commit the transaction
      await transaction.commit();
      
      // Return the enrollment details
      const enrollment = {
        id: enrollmentId,
        courseId,
        userId: user.id,
        status: body.status || 'pending',
        paymentStatus: body.paymentStatus || 'pending',
        paymentId: body.paymentId,
        paymentAmount,
        enrollmentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json(enrollment, { status: 201 });
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in the course' },
      { status: 500 }
    );
  }
}

// GET enrollments for a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { courseId } = params;
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    // Check if course exists
    const courseExists = await client.execute({
      sql: 'SELECT id FROM training_courses WHERE id = ? AND is_deleted = FALSE',
      args: [courseId]
    });
    
    if (!courseExists.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Get total count
    const countResult = await client.execute({
      sql: `
        SELECT COUNT(*) as total 
        FROM training_enrollments 
        WHERE course_id = ? AND is_deleted = FALSE
      `,
      args: [courseId]
    });
    
    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    // Get enrollments with user information
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
          u.first_name as firstName,
          u.last_name as lastName,
          u.full_name as fullName,
          u.email,
          u.avatar_url as avatarUrl
        FROM training_enrollments e
        LEFT JOIN users u ON e.user_id = u.id
        WHERE e.course_id = ? AND e.is_deleted = FALSE
        ORDER BY e.enrollment_date DESC
        LIMIT ? OFFSET ?
      `,
      args: [courseId, limit, offset]
    });
    
    const enrollments = result.rows.map(row => ({
      ...row,
      paymentAmount: row.paymentAmount ? Number(row.paymentAmount) : null,
      rating: row.rating ? Number(row.rating) : null
    }));
    
    return NextResponse.json({
      enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
    
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}