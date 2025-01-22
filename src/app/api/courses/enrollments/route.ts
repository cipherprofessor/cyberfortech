import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    // Check if user is already enrolled
    const existingEnrollment = await db.execute({
      sql: `
        SELECT id FROM enrollments
        WHERE user_id = ? AND course_id = ?
      `,
      args: [userId, courseId]
    });

    if (existingEnrollment.rows.length) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create new enrollment
    const result = await db.execute({
      sql: `
        INSERT INTO enrollments (id, user_id, course_id, status)
        VALUES (?, ?, ?, ?)
      `,
      args: [crypto.randomUUID(), userId, courseId, 'active']
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
