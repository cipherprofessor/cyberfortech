// src/app/api/training/user/enrollments/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET enrollments for the current user
export async function GET(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Filtering parameters
    const status = searchParams.get('status');
    
    // Build WHERE clause
    let whereClause = 'WHERE e.user_id = ? AND e.is_deleted = FALSE';
    const queryParams: any[] = [user.id];
    
    if (status) {
      whereClause += ' AND e.status = ?';
      queryParams.push(status);
    }
    
    // Get total count
    const countResult = await client.execute({
      sql: `
        SELECT COUNT(*) as total 
        FROM training_enrollments e 
        ${whereClause}
      `,
      args: queryParams
    });
    
    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    // Get enrollments with course details
    const result = await client.execute({
      sql: `
        SELECT 
          e.id,
          e.course_id as courseId,
          e.status,
          e.payment_status as paymentStatus,
          e.enrollment_date as enrollmentDate,
          e.completion_date as completionDate,
          e.feedback,
          e.rating,
          c.title as courseTitle,
          c.description as courseDescription,
          c.dates as courseDates,
          c.time as courseTime,
          c.duration as courseDuration,
          c.mode as courseMode,
          c.instructor as courseInstructor,
          c.level as courseLevel,
          c.category as courseCategory
        FROM training_enrollments e
        JOIN training_courses c ON e.course_id = c.id
        ${whereClause}
        ORDER BY e.enrollment_date DESC
        LIMIT ? OFFSET ?
      `,
      args: [...queryParams, limit, offset]
    });
    
    const enrollments = result.rows.map(row => ({
      ...row,
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
    console.error('Error fetching user enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}