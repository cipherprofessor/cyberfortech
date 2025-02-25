// src/app/api/courses/manage/route.ts
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          c.*,
          i.name as instructor_name,
          i.profile_image_url as instructor_profile_image_url,
          (
            SELECT COUNT(*)
            FROM enrollments
            WHERE course_id = c.id
          ) as total_students,
          (
            SELECT COUNT(*)
            FROM course_reviews
            WHERE course_id = c.id
          ) as total_reviews,
          (
            SELECT AVG(rating)
            FROM course_reviews
            WHERE course_id = c.id
          ) as average_rating
        FROM courses c
        LEFT JOIN instructors i ON c.instructor_id = i.id
        ORDER BY c.created_at DESC
      `,
      args: []
    });

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

    // Generate a UUID for the course
    const courseId = uuidv4();
    
    console.log("Creating course with ID:", courseId);

    // Execute the insert with explicit id value
    const result = await db.execute({
      sql: `
        INSERT INTO courses (
          id, title, description, price, duration, level,
          category, instructor_id, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        courseId,
        title,
        description,
        price,
        duration,
        level,
        category,
        instructor_id,
        image_url
      ]
    });

    // Log the result for debugging
    console.log("Insert result:", result);

    // Verify the course was created by checking it exists
    const verification = await db.execute({
      sql: "SELECT id FROM courses WHERE id = ?",
      args: [courseId]
    });
    
    console.log("Verification result:", verification.rows);

    return NextResponse.json({ 
      message: 'Course created successfully',
      courseId: courseId
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course', details: String(error) },
      { status: 500 }
    );
  }
}