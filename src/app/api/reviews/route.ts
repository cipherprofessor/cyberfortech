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

    const { courseId, rating, content } = await request.json();

    // Validate the user is enrolled in the course
    const enrollment = await db.execute({
      sql: `
        SELECT id FROM enrollments
        WHERE user_id = ? AND course_id = ?
      `,
      args: [userId, courseId]
    });

    if (!enrollment.rows.length) {
      return NextResponse.json(
        { error: 'Must be enrolled to review the course' },
        { status: 400 }
      );
    }

    // Create the review
    const result = await db.execute({
      sql: `
        INSERT INTO reviews (id, user_id, course_id, rating, content)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [crypto.randomUUID(), userId, courseId, rating, content]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}