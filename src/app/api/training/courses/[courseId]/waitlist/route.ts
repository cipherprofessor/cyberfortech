// src/app/api/training/courses/[courseId]/waitlist/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET waitlist for a course (admin only)
export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    
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
        FROM training_waitlist 
        WHERE course_id = ? AND is_deleted = FALSE
      `,
      args: [courseId]
    });
    
    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    // Get waitlist entries with user information
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
          u.first_name as firstName,
          u.last_name as lastName,
          u.full_name as fullName,
          u.email,
          u.avatar_url as avatarUrl
        FROM training_waitlist w
        LEFT JOIN users u ON w.user_id = u.id
        WHERE w.course_id = ? AND w.is_deleted = FALSE
        ORDER BY w.joined_at ASC
        LIMIT ? OFFSET ?
      `,
      args: [courseId, limit, offset]
    });
    
    const waitlist = result.rows.map(row => ({
      ...row,
      notificationSent: Boolean(row.notificationSent)
    }));
    
    return NextResponse.json({
      waitlist,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
    
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}

// POST - Join a course waitlist
export async function POST(
  request: Request,
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
    
    // Check if course exists and is at capacity
    const courseResult = await client.execute({
      sql: `
        SELECT 
          id, 
          max_capacity as maxCapacity, 
          current_enrollment as currentEnrollment,
          is_active as isActive
        FROM training_courses 
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [courseId]
    });
    
    if (!courseResult.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const course = courseResult.rows[0];
    
    // Check if course is active
    if (!course.isActive) {
      return NextResponse.json(
        { error: 'Course is not active' },
        { status: 400 }
      );
    }
    
    const maxCapacity = Number(course.maxCapacity);
    const currentEnrollment = Number(course.currentEnrollment);
    
    // Check if course is at capacity (otherwise waitlist doesn't make sense)
    if (currentEnrollment < maxCapacity) {
      return NextResponse.json(
        { error: 'Course is not at capacity, direct enrollment is available' },
        { status: 400 }
      );
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await client.execute({
      sql: `
        SELECT id 
        FROM training_enrollments 
        WHERE course_id = ? AND user_id = ? AND is_deleted = FALSE
      `,
      args: [courseId, user.id]
    });
    
    if (existingEnrollment.rows.length > 0) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Check if user is already on the waitlist
    const existingWaitlist = await client.execute({
      sql: `
        SELECT id, status
        FROM training_waitlist 
        WHERE course_id = ? AND user_id = ? AND is_deleted = FALSE
      `,
      args: [courseId, user.id]
    });
    
    if (existingWaitlist.rows.length > 0) {
      // If user is on waitlist but status is expired, update it
      if (existingWaitlist.rows[0].status === 'expired') {
        await client.execute({
          sql: `
            UPDATE training_waitlist
            SET 
              status = 'waiting',
              notification_sent = FALSE,
              notification_date = NULL,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          args: [existingWaitlist.rows[0].id]
        });
        
        return NextResponse.json({
          message: 'Waitlist entry reactivated',
          id: existingWaitlist.rows[0].id,
          courseId,
          userId: user.id,
          status: 'waiting',
          joinedAt: new Date().toISOString()
        });
      } else {
        return NextResponse.json(
          { error: 'You are already on the waitlist for this course' },
          { status: 400 }
        );
      }
    }
    
    // Generate waitlist entry ID
    const waitlistId = nanoid();
    
    // Add user to waitlist
    await client.execute({
      sql: `
        INSERT INTO training_waitlist (
          id,
          course_id,
          user_id,
          joined_at,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'waiting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        waitlistId,
        courseId,
        user.id
      ]
    });
    
    // Return waitlist entry
    const waitlistEntry = {
      id: waitlistId,
      courseId,
      userId: user.id,
      status: 'waiting',
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(waitlistEntry, { status: 201 });
    
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to join the waitlist' },
      { status: 500 }
    );
  }
}