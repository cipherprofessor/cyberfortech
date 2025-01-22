// src/app/api/courses/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const result = await db.execute(`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.avatar_url as instructor_avatar,
        COUNT(DISTINCT e.id) as total_students,
        AVG(r.rating) as average_rating,
        COUNT(DISTINCT r.id) as total_reviews
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, price, duration, level, category } = body;

    const courseId = crypto.randomUUID();

    await db.execute({
      sql: `
        INSERT INTO courses (
          id, 
          title, 
          description, 
          price, 
          duration, 
          level, 
          category,
          instructor_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        courseId,
        title,
        description,
        price,
        duration,
        level,
        category,
        userId
      ]
    });

    return NextResponse.json({ 
      success: true,
      courseId
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

// For specific course operations
export async function getCourseById(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          c.*,
          u.name as instructor_name,
          u.avatar_url as instructor_avatar,
          COUNT(DISTINCT e.id) as total_students,
          AVG(r.rating) as average_rating,
          COUNT(DISTINCT r.id) as total_reviews
        FROM courses c
        LEFT JOIN users u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN reviews r ON c.id = r.course_id
        WHERE c.id = ?
        GROUP BY c.id
      `,
      args: [params.courseId]
    });

    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}