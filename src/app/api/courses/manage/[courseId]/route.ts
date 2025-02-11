// src/app/api/courses/manage/[courseId]/route.ts
import { db } from '@/lib/db';
import { Transaction } from '@libsql/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;
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
      args: [courseId]
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
    const courseId = params.courseId;
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

    await db.execute({
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
        courseId
      ]
    });

    return NextResponse.json({ 
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


export async function DELETE(
    request: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
      const courseId = params.courseId;
      const transaction = db.transaction('write');
  
      try {
        // Delete enrollments
        await (await transaction).execute({
          sql: 'DELETE FROM enrollments WHERE course_id = ?',
          args: [courseId]
        });
  
        // Delete reviews 
        await (await transaction).execute({
          sql: 'DELETE FROM course_reviews WHERE course_id = ?',
          args: [courseId]
        });
  
        // Delete course sections and lessons
        const sections = await (await transaction).execute({
          sql: 'SELECT id FROM course_sections WHERE course_id = ?',
          args: [courseId]
        });
  
        for (const section of sections.rows) {
          await (await transaction).execute({
            sql: 'DELETE FROM course_lessons WHERE section_id = ?',
            args: [section.id]
          });
        }
  
        await (await transaction).execute({
          sql: 'DELETE FROM course_sections WHERE course_id = ?',
          args: [courseId]
        });
  
        // Finally delete the course
        await (await transaction).execute({
          sql: 'DELETE FROM courses WHERE id = ?',
          args: [courseId]
        });
  
        await (await transaction).commit();
        
        return NextResponse.json({ 
          message: 'Course deleted successfully' 
        });
      } catch (error) {
        await (await transaction).rollback();
        throw error;
      } finally {
        (await transaction).close();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      return NextResponse.json(
        { error: 'Failed to delete course' },
        { status: 500 }
      );
    }
  }