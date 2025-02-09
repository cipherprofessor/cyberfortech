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
        i.name as instructor_name,
        i.profile_image_url as instructor_avatar,
        COUNT(DISTINCT e.id) as total_students,
        AVG(r.rating) as average_rating,
        COUNT(DISTINCT r.id) as total_reviews
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN course_reviews r ON c.id = r.course_id
      GROUP BY c.id, i.name, i.profile_image_url
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

    // First, get the instructor ID for this user
    const instructorResult = await db.execute({
      sql: 'SELECT id FROM instructors WHERE user_id = ?',
      args: [userId]
    });

    if (!instructorResult.rows.length) {
      return NextResponse.json(
        { error: 'User is not an instructor' },
        { status: 403 }
      );
    }

    const instructorId = instructorResult.rows[0].id;
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
          instructor_id,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        courseId,
        title,
        description,
        price,
        duration,
        level,
        category,
        instructorId
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

export async function getCourseById(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          c.*,
          i.name as instructor_name,
          i.profile_image_url as instructor_avatar,
          COUNT(DISTINCT e.id) as total_students,
          AVG(r.rating) as average_rating,
          COUNT(DISTINCT r.id) as total_reviews
        FROM courses c
        LEFT JOIN instructors i ON c.instructor_id = i.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN course_reviews r ON c.id = r.course_id
        WHERE c.id = ?
        GROUP BY c.id, i.name, i.profile_image_url
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