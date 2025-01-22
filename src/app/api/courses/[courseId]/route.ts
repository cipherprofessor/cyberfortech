import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
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
      args: [courseId]
    });

    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const course = result.rows[0];

    // Fetch course sections and lessons
    const sectionsResult = await db.execute({
      sql: `
        SELECT 
          s.*,
          json_group_array(json_object(
            'id', l.id,
            'title', l.title,
            'duration', l.duration,
            'order_index', l.order_index
          )) as lessons
        FROM course_sections s
        LEFT JOIN course_lessons l ON s.id = l.section_id
        WHERE s.course_id = ?
        GROUP BY s.id
        ORDER BY s.order_index
      `,
      args: [courseId]
    });

    return NextResponse.json({
      ...course,
      sections: sectionsResult.rows
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
