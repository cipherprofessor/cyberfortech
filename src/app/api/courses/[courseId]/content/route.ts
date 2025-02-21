//src/app/api/courses/[courseId]/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { headers } from 'next/headers';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
});

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
     // Validate and sanitize courseId
     const { courseId } = params;
     if (!courseId || typeof courseId !== 'string') {
       return NextResponse.json(
         { error: 'Invalid course ID' },
         { status: 400 }
       );
     }
 

    const headersList = headers();
    const userId = (await headersList).get('x-user-id');

      // First check if course exists
      const courseCheck = await client.execute({
        sql: 'SELECT id FROM courses WHERE id = ?',
        args: [courseId]
      });
  
      if (courseCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }

     // Fetch course content details
     const courseContent = await client.execute({
      sql: `
        SELECT 
          COALESCE(cc.course_demo_url, '') as course_demo_url,
          COALESCE(cc.course_outline, '') as course_outline,
          COALESCE(cc.learning_objectives, '[]') as learning_objectives,
          COALESCE(cc.prerequisites, '[]') as prerequisites,
          COALESCE(cc.target_audience, '') as target_audience,
          COALESCE(cc.estimated_completion_time, '') as estimated_completion_time,
          c.title as course_title,
          c.description as course_description,
          c.image_url,
          c.level,
          i.name as instructor_name
        FROM courses c
        LEFT JOIN course_content cc ON c.id = cc.course_id
        LEFT JOIN instructors i ON i.id = c.instructor_id
        WHERE c.id = ?
      `,
      args: [courseId]
    });

    // Ensure we have at least an empty object if no content exists
    const defaultContent = {
      course_demo_url: '',
      course_outline: '',
      learning_objectives: [],
      prerequisites: [],
      target_audience: '',
      estimated_completion_time: '',
      course_title: '',
      course_description: '',
      image_url: '',
      level: '',
      instructor_name: ''
    };

    
    // Fetch sections with lessons
    const sections = await client.execute({
      sql: `
        SELECT 
          cs.id,
          cs.title,
          cs.description,
          cs.sequence_number,
          json_group_array(
            json_object(
              'id', cl.id,
              'title', cl.title,
              'description', cl.description,
              'contentType', cl.content_type,
              'duration', cl.duration,
              'isFreePreview', cl.is_free_preview,
              'sequenceNumber', cl.sequence_number,
              'progress', (
                SELECT completion_status 
                FROM lesson_progress 
                WHERE lesson_id = cl.id 
                AND user_id = ?
              )
            )
          ) as lessons
        FROM course_sections cs
        LEFT JOIN course_lessons cl ON cs.id = cl.section_id
        WHERE cs.course_id = ?
        GROUP BY cs.id
        ORDER BY cs.sequence_number, cl.sequence_number
      `,
      args: [userId || '', courseId]
    });

    // Get lesson content details
    const lessonContent = await client.execute({
      sql: `
        SELECT 
          clc.*,
          cl.id as lesson_id,
          cl.title as lesson_title,
          cl.content_type,
          cl.duration,
          cl.is_free_preview
        FROM course_lesson_content clc
        JOIN course_lessons cl ON cl.id = clc.lesson_id
        WHERE cl.section_id IN (
          SELECT id FROM course_sections 
          WHERE course_id = ?
        )
      `,
      args: [courseId]
    });

    // Transform the sections data to parse the JSON array
    const transformedSections = sections.rows.map(section => ({
      ...section,
      lessons: JSON.parse(section.lessons as string)
    }));

    return NextResponse.json({
      courseContent: courseContent.rows[0] || null,
      sections: transformedSections,
      lessonContent: lessonContent.rows
    });

  } catch (error) {
    console.error('Error fetching course content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course content' },
      { status: 500 }
    );
  }
}