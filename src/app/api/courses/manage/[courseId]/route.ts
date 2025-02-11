// src/app/api/courses/manage/[courseId]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Instead of using a transaction directly, we'll use execute with multiple statements
    const result = await db.execute({
      sql: `
        -- Delete reviews
        DELETE FROM course_reviews WHERE course_id = ?;
        
        -- Delete enrollments
        DELETE FROM enrollments WHERE course_id = ?;
        
        -- Delete lessons from all sections of this course
        DELETE FROM course_lessons 
        WHERE section_id IN (
          SELECT id FROM course_sections WHERE course_id = ?
        );
        
        -- Delete sections
        DELETE FROM course_sections WHERE course_id = ?;
        
        -- Finally delete the course
        DELETE FROM courses WHERE id = ?;
      `,
      args: [
        params.courseId,
        params.courseId,
        params.courseId,
        params.courseId,
        params.courseId
      ]
    });

    // Check if any rows were affected
    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Course deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          c.*,
          i.name as instructor_name,
          i.profile_image_url as instructor_profile_image_url
        FROM courses c
        LEFT JOIN instructors i ON c.instructor_id = i.id
        WHERE c.id = ?
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

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const data = await request.json();
    const {
      title,
      description,
      price,
      duration,
      level,
      category,
      instructor_id,
      image_url
    } = data;

    const result = await db.execute({
      sql: `
        UPDATE courses
        SET 
          title = ?,
          description = ?,
          price = ?,
          duration = ?,
          level = ?,
          category = ?,
          instructor_id = ?,
          image_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        title,
        description,
        price,
        duration,
        level,
        category,
        instructor_id,
        image_url,
        params.courseId
      ]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Course updated successfully' 
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}