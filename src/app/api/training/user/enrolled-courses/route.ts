// src/app/api/training/user/enrolled-courses/route.ts
import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { Row } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * GET - Check if user is enrolled in specific courses
 * Query parameters:
 * - courseIds: Comma-separated list of course IDs to check
 * Returns an object with courseId as key and enrollment status as value
 */
export async function GET(request: NextRequest) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const courseIdsParam = searchParams.get('courseIds');
    
    // If no course IDs provided, return empty object
    if (!courseIdsParam) {
      return NextResponse.json({ enrollments: {} });
    }
    
    const courseIds = courseIdsParam.split(',');
    
    // If empty after splitting, return empty object
    if (courseIds.length === 0) {
      return NextResponse.json({ enrollments: {} });
    }
    
    // Use placeholders for the SQL query
    const placeholders = courseIds.map(() => '?').join(',');
    
    // Get enrollments for the specified courses
    const result = await client.execute({
      sql: `
        SELECT 
          course_id as courseId,
          status
        FROM training_enrollments
        WHERE user_id = ? 
          AND course_id IN (${placeholders})
          AND is_deleted = FALSE
      `,
      args: [user.id, ...courseIds]
    });
    
    // Convert to object with courseId as key and status as value
    const enrollments: Record<string, string> = {};
    
    // Fixed: Use Row type from libsql client
    result.rows.forEach((row: Row) => {
      const rowObj = row as any;
      if (rowObj.courseId && typeof rowObj.courseId === 'string' && 
          rowObj.status && typeof rowObj.status === 'string') {
        enrollments[rowObj.courseId] = rowObj.status;
      }
    });
    
    return NextResponse.json({ enrollments });
    
  } catch (error) {
    console.error('Error checking course enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to check course enrollments' },
      { status: 500 }
    );
  }
}