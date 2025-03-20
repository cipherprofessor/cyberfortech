// src/app/api/training/waitlist/[waitlistId]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface WaitlistUpdateBody {
  status?: 'waiting' | 'invited' | 'enrolled' | 'expired';
  notificationSent?: boolean;
}

// GET a specific waitlist entry
export async function GET(
  request: Request,
  { params }: { params: { waitlistId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { waitlistId } = params;
    
    const result = await client.execute({
      sql: `
        SELECT 
          w.id,
          w.course_id as courseId,
          w.user_id as userId,
          w.joined_at as joinedAt,
          w.status,
          w.notification_sent as notificationSent,
          w.notification_date as notificationDate,
          w.created_at as createdAt,
          w.updated_at as updatedAt,
          c.title as courseTitle,
          c.dates as courseDates,
          c.time as courseTime
        FROM training_waitlist w
        JOIN training_courses c ON w.course_id = c.id
        WHERE w.id = ? AND w.is_deleted = FALSE
      `,
      args: [waitlistId]
    });
    
    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      );
    }
    
    // Only allow users to see their own waitlist entries or admins to see any
    const waitlistEntry = result.rows[0];
    if (user.id !== waitlistEntry.userId && !user.role?.includes(ROLES.ADMIN)) {
      return NextResponse.json(
        { error: 'Unauthorized to access this waitlist entry' },
        { status: 403 }
      );
    }
    
    waitlistEntry.notificationSent = Boolean(waitlistEntry.notificationSent);
    
    return NextResponse.json(waitlistEntry);
    
  } catch (error) {
    console.error('Error fetching waitlist entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist entry' },
      { status: 500 }
    );
  }
}

// UPDATE a waitlist entry (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { waitlistId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { waitlistId } = params;
    const body = await request.json() as WaitlistUpdateBody;
    
    // Check if waitlist entry exists
    const waitlistResult = await client.execute({
      sql: `
        SELECT 
          id, 
          user_id as userId, 
          course_id as courseId, 
          status
        FROM training_waitlist 
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [waitlistId]
    });
    
    if (!waitlistResult.rows.length) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      );
    }
    
    const waitlistEntry = waitlistResult.rows[0];
    
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
    
    // Add fields to update
    addField('status', body.status);
    addField('notificationSent', body.notificationSent !== undefined ? (body.notificationSent ? 1 : 0) : undefined, 'notification_sent');
    
    // Only set notification date if notification is being sent
    if (body.notificationSent) {
      updates.push('notification_date = CURRENT_TIMESTAMP');
    }
    
    // Only proceed if there are fields to update
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    // Start a transaction
    const transaction = await client.transaction();
    
    try {
      // Update waitlist entry
      await transaction.execute({
        sql: `
          UPDATE training_waitlist
          SET ${updates.join(', ')}
          WHERE id = ? AND is_deleted = FALSE
        `,
        args: [...queryParams, waitlistId]
      });
      
      // If status is changed to 'enrolled', create an enrollment
      if (body.status === 'enrolled') {
        // Check if user is already enrolled
        const existingEnrollment = await transaction.execute({
          sql: `
            SELECT id 
            FROM training_enrollments 
            WHERE course_id = ? AND user_id = ? AND is_deleted = FALSE
          `,
          args: [waitlistEntry.courseId, waitlistEntry.userId]
        });
        
        if (existingEnrollment.rows.length === 0) {
          // Check if course has space
          const courseResult = await transaction.execute({
            sql: `
              SELECT 
                max_capacity as maxCapacity, 
                current_enrollment as currentEnrollment
              FROM training_courses 
              WHERE id = ? AND is_deleted = FALSE
            `,
            args: [waitlistEntry.courseId]
          });
          
          if (courseResult.rows.length > 0) {
            const course = courseResult.rows[0];
            const maxCapacity = Number(course.maxCapacity);
            const currentEnrollment = Number(course.currentEnrollment);
            
            if (currentEnrollment < maxCapacity) {
              // Create enrollment
              const enrollmentId = nanoid();
              
              await transaction.execute({
                sql: `
                  INSERT INTO training_enrollments (
                    id,
                    course_id,
                    user_id,
                    status,
                    payment_status,
                    enrollment_date,
                    created_at,
                    updated_at
                  ) VALUES (?, ?, ?, 'confirmed', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `,
                args: [
                  enrollmentId,
                  waitlistEntry.courseId,
                  waitlistEntry.userId
                ]
              });
            }
          }
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      // Fetch the updated waitlist entry
      const updatedResult = await client.execute({
        sql: `
          SELECT 
            id,
            course_id as courseId,
            user_id as userId,
            joined_at as joinedAt,
            status,
            notification_sent as notificationSent,
            notification_date as notificationDate,
            created_at as createdAt,
            updated_at as updatedAt
          FROM training_waitlist
          WHERE id = ? AND is_deleted = FALSE
        `,
        args: [waitlistId]
      });
      
      const updatedEntry = updatedResult.rows[0];
      updatedEntry.notificationSent = Boolean(updatedEntry.notificationSent);
      
      return NextResponse.json(updatedEntry);
      
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error updating waitlist entry:', error);
    return NextResponse.json(
      { error: 'Failed to update waitlist entry' },
      { status: 500 }
    );
  }
}

// DELETE a waitlist entry (leave waitlist)
export async function DELETE(
  request: Request,
  { params }: { params: { waitlistId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { waitlistId } = params;
    
    // Check if waitlist entry exists
    const waitlistResult = await client.execute({
      sql: 'SELECT id, user_id as userId FROM training_waitlist WHERE id = ? AND is_deleted = FALSE',
      args: [waitlistId]
    });
    
    if (!waitlistResult.rows.length) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to delete this waitlist entry
    const waitlistEntry = waitlistResult.rows[0];
    const isAdmin = user.roles?.includes(ROLES.ADMIN);
    
    if (user.id !== waitlistEntry.userId && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to remove this waitlist entry' },
        { status: 403 }
      );
    }
    
    // Soft delete the waitlist entry
    await client.execute({
      sql: `
        UPDATE training_waitlist
        SET 
          is_deleted = TRUE,
          status = 'expired',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [waitlistId]
    });
    
    return NextResponse.json({
      message: 'Removed from waitlist successfully'
    });
    
  } catch (error) {
    console.error('Error deleting waitlist entry:', error);
    return NextResponse.json(
      { error: 'Failed to remove from waitlist' },
      { status: 500 }
    );
  }
}