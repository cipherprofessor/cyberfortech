import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


function safeString(value: unknown): string {
  return String(value || '');
}

function safeNumber(value: unknown): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Access courseId directly from params object
    const { courseId } = params;

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

    const row = result.rows[0];
    
    const course: Course = {
      id: safeString(row.id),
      title: safeString(row.title),
      description: safeString(row.description),
      image_url: safeString(row.image_url),
      price: safeNumber(row.price),
      duration: safeString(row.duration),
      level: safeString(row.level) as Course['level'],
      instructor_id: safeString(row.instructor_id),
      instructor_name: row.instructor_name ? safeString(row.instructor_name) : null,
      instructor_profile_image_url: row.instructor_profile_image_url ? safeString(row.instructor_profile_image_url) : null,
      category: safeString(row.category),
      created_at: safeString(row.created_at),
      updated_at: safeString(row.updated_at),
      average_rating: safeNumber(row.average_rating),
      total_students: safeNumber(row.total_students),
      total_reviews: safeNumber(row.total_reviews)
    };

    const sectionsResult = await db.execute({
      sql: `
        WITH lesson_data AS (
          SELECT 
            section_id,
            json_group_array(
              json_object(
                'id', id,
                'title', title,
                'duration', duration,
                'order_index', order_index
              )
            ) as lessons
          FROM course_lessons
          GROUP BY section_id
        )
        SELECT 
          cs.*,
          COALESCE(ld.lessons, '[]') as lessons
        FROM course_sections cs
        LEFT JOIN lesson_data ld ON cs.id = ld.section_id
        WHERE cs.course_id = ?
        ORDER BY cs.order_index
      `,
      args: [courseId]
    });

    const sections = sectionsResult.rows.map(row => ({
      id: safeString(row.id),
      title: safeString(row.title),
      order_index: safeNumber(row.order_index),
      course_id: safeString(row.course_id),
      lessons: JSON.parse(safeString(row.lessons)) as CourseLesson[]
    }));

    return NextResponse.json({
      ...course,
      sections
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}