// src/app/api/courses/[courseId]/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { headers } from 'next/headers';

// Define response types
interface CourseContent {
  course_demo_url: string;
  course_outline: string;
  learning_objectives: string[];
  prerequisites: string[];
  target_audience: string;
  estimated_completion_time: string;
  course_title: string;
  course_description: string;
  image_url: string;
  level: string;
  instructor_name: string;
}

interface LessonContent {
  id: string;
  lesson_id: string;
  content_type: string;
  video_url: string | null;
  article_content: string | null;
  quiz_data: string | null;
  assignment_details: string | null;
}

// Initialize database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Default content for new courses
const defaultContent: CourseContent = {
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

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Use Promise.resolve to handle both promise and non-promise params
    const resolvedParams = await Promise.resolve(params);
    const courseId = resolvedParams.courseId;
    
    if (!courseId || typeof courseId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

     // Get user ID from headers
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

    // Fetch sections with lessons
    const sections = await client.execute({
      sql: `
        SELECT 
          cs.id,
          cs.title,
          cs.description,
          cs.sequence_number,
          json_group_array(
            CASE 
              WHEN cl.id IS NOT NULL THEN
                json_object(
                  'id', cl.id,
                  'title', cl.title,
                  'description', cl.description,
                  'contentType', cl.content_type,
                  'duration', COALESCE(cl.duration, 0),
                  'isFreePreview', cl.is_free_preview,
                  'sequenceNumber', cl.sequence_number,
                  'progress', COALESCE(
                    (SELECT completion_status 
                    FROM lesson_progress 
                    WHERE lesson_id = cl.id 
                    AND user_id = ?),
                    'not_started'
                  )
                )
              ELSE '{}'
            END
          ) as lessons
        FROM course_sections cs
        LEFT JOIN course_lessons cl ON cs.id = cl.section_id
        WHERE cs.course_id = ?
        GROUP BY cs.id
        ORDER BY cs.sequence_number
      `,
      args: [userId || '', courseId]
    });

    // Fetch lesson content details
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
        ORDER BY cl.sequence_number
      `,
      args: [courseId]
    });

    // Transform sections data to parse JSON arrays and remove empty lesson objects
    const transformedSections = sections.rows.map(section => ({
      ...section,
      lessons: JSON.parse(section.lessons as string)
        .filter((lesson: any) => lesson.id)
    }));

    // Format the response
    const response = {
      courseContent: {
        ...defaultContent,
        ...courseContent.rows[0]
      },
      sections: transformedSections,
      lessonContent: lessonContent.rows
    };

    // Parse string arrays back to actual arrays
    if (typeof response.courseContent.learning_objectives === 'string') {
      response.courseContent.learning_objectives = JSON.parse(response.courseContent.learning_objectives);
    }
    if (typeof response.courseContent.prerequisites === 'string') {
      response.courseContent.prerequisites = JSON.parse(response.courseContent.prerequisites);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching course content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch course content',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}