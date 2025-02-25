// src/app/api/courses/[courseId]/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Define request types
interface CourseContentRequest {
  courseContent: {
    course_demo_url: string;
    course_outline: string;
    learning_objectives: string[];
    prerequisites: string[];
    target_audience: string;
    estimated_completion_time: string;
  };
  sections: {
    title: string;
    description: string;
    sequence_number: number;
    lessons: {
      title: string;
      description: string;
      content_type: string;
      duration: number;
      is_free_preview: boolean;
      sequence_number: number;
      content: {
        video_url?: string;
        article_content?: string;
        quiz_data?: any;
        assignment_details?: any;
      };
    }[];
  }[];
}

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

export async function POST(
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

    // Get user ID from headers for auditing purposes
    const headersList = headers();
    const userId = (await headersList).get('x-user-id');

    // First check if course exists
    const courseCheck = await client.execute({
      sql: 'SELECT id, instructor_id FROM courses WHERE id = ?',
      args: [courseId]
    });

    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const instructorId = courseCheck.rows[0].instructor_id;

    // Parse request body
    const requestData: CourseContentRequest = await request.json();
    const { courseContent, sections } = requestData;

    // Begin transaction
    await client.execute({ sql: 'BEGIN TRANSACTION', args: [] });

    try {
      // Check if course content exists
      const courseContentCheck = await client.execute({
        sql: 'SELECT id FROM course_content WHERE course_id = ?',
        args: [courseId]
      });

      if (courseContentCheck.rows.length === 0) {
        // Create new course content
        await client.execute({
          sql: `
            INSERT INTO course_content (
              id, 
              course_id, 
              instructor_id, 
              course_demo_url, 
              course_outline, 
              learning_objectives, 
              prerequisites, 
              target_audience, 
              estimated_completion_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            uuidv4(),
            courseId,
            instructorId,
            courseContent.course_demo_url || '',
            courseContent.course_outline || '',
            JSON.stringify(courseContent.learning_objectives || []),
            JSON.stringify(courseContent.prerequisites || []),
            courseContent.target_audience || '',
            courseContent.estimated_completion_time || ''
          ]
        });
      } else {
        // Update existing course content
        await client.execute({
          sql: `
            UPDATE course_content SET
              course_demo_url = ?,
              course_outline = ?,
              learning_objectives = ?,
              prerequisites = ?,
              target_audience = ?,
              estimated_completion_time = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE course_id = ?
          `,
          args: [
            courseContent.course_demo_url || '',
            courseContent.course_outline || '',
            JSON.stringify(courseContent.learning_objectives || []),
            JSON.stringify(courseContent.prerequisites || []),
            courseContent.target_audience || '',
            courseContent.estimated_completion_time || '',
            courseId
          ]
        });
      }

      // Get existing sections to check which ones to update/delete
      const existingSections = await client.execute({
        sql: 'SELECT id FROM course_sections WHERE course_id = ?',
        args: [courseId]
      });
      
      const existingSectionIds = existingSections.rows.map(row => String(row.id)).filter(id => id !== null);
      const newSectionIds: (string | number | bigint | ArrayBuffer)[] = [];

      // Process sections
      for (const section of sections) {
        let sectionId;
        
        // Check if section exists by sequence number
        const sectionCheck = await client.execute({
          sql: 'SELECT id FROM course_sections WHERE course_id = ? AND sequence_number = ?',
          args: [courseId, section.sequence_number]
        });

        if (sectionCheck.rows.length === 0) {
          // Create new section
          sectionId = uuidv4();
          await client.execute({
            sql: `
              INSERT INTO course_sections (
                id, 
                course_id, 
                title, 
                description, 
                sequence_number
              ) VALUES (?, ?, ?, ?, ?)
            `,
            args: [
              sectionId,
              courseId,
              section.title,
              section.description,
              section.sequence_number
            ]
          });
        } else {
          // Update existing section
          sectionId = sectionCheck.rows[0].id;
          await client.execute({
            sql: `
              UPDATE course_sections SET
                title = ?,
                description = ?,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `,
            args: [
              section.title,
              section.description,
              sectionId
            ]
          });
        }

        newSectionIds.push(sectionId);

        // Get existing lessons for this section
        const existingLessons = await client.execute({
          sql: 'SELECT id FROM course_lessons WHERE section_id = ?',
          args: [sectionId]
        });
        
        const existingLessonIds = existingLessons.rows.map(row => row.id);
        const newLessonIds: string[] = [];

        // Process lessons
        for (const lesson of section.lessons) {
          let lessonId;
          
          // Check if lesson exists by sequence number
          const lessonCheck = await client.execute({
            sql: 'SELECT id FROM course_lessons WHERE section_id = ? AND sequence_number = ?',
            args: [sectionId, lesson.sequence_number]
          });

          if (lessonCheck.rows.length === 0) {
            // Create new lesson
            lessonId = uuidv4();
            await client.execute({
              sql: `
                INSERT INTO course_lessons (
                  id, 
                  section_id, 
                  title, 
                  description, 
                  content_type, 
                  duration, 
                  is_free_preview, 
                  sequence_number
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `,
              args: [
                lessonId,
                sectionId,
                lesson.title,
                lesson.description,
                lesson.content_type,
                lesson.duration,
                lesson.is_free_preview ? 1 : 0,
                lesson.sequence_number
              ]
            });
          } else {
            // Update existing lesson
            lessonId = lessonCheck.rows[0].id;
            await client.execute({
              sql: `
                UPDATE course_lessons SET
                  title = ?,
                  description = ?,
                  content_type = ?,
                  duration = ?,
                  is_free_preview = ?,
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
              `,
              args: [
                lesson.title,
                lesson.description,
                lesson.content_type,
                lesson.duration,
                lesson.is_free_preview ? 1 : 0,
                lessonId
              ]
            });
          }

          newLessonIds.push(lessonId);

          // Check if lesson content exists
          const lessonContentCheck = await client.execute({
            sql: 'SELECT id FROM course_lesson_content WHERE lesson_id = ?',
            args: [lessonId]
          });

          // Prepare content fields based on lesson type
          let videoUrl: string | null = null;
          let articleContent: string | null = null;
          let quizData: string | null = null;
          let assignmentDetails: string | null = null;

          if (lesson.content_type === 'video' && lesson.content.video_url) {
            videoUrl = lesson.content.video_url;
          } else if (lesson.content_type === 'article' && lesson.content.article_content) {
            articleContent = lesson.content.article_content;
          } else if (lesson.content_type === 'quiz' && lesson.content.quiz_data) {
            quizData = JSON.stringify(lesson.content.quiz_data);
          } else if (lesson.content_type === 'assignment' && lesson.content.assignment_details) {
            assignmentDetails = JSON.stringify(lesson.content.assignment_details);
          }

          if (lessonContentCheck.rows.length === 0) {
            // Create new lesson content
            await client.execute({
              sql: `
                INSERT INTO course_lesson_content (
                  id,
                  lesson_id,
                  content_type,
                  video_url,
                  article_content,
                  quiz_data,
                  assignment_details
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
              args: [
                uuidv4(),
                lessonId,
                lesson.content_type,
                videoUrl,
                articleContent,
                quizData,
                assignmentDetails
              ]
            });
          } else {
            // Update existing lesson content
            await client.execute({
              sql: `
                UPDATE course_lesson_content SET
                  content_type = ?,
                  video_url = ?,
                  article_content = ?,
                  quiz_data = ?,
                  assignment_details = ?,
                  updated_at = CURRENT_TIMESTAMP
                WHERE lesson_id = ?
              `,
              args: [
                lesson.content_type,
                videoUrl,
                articleContent,
                quizData,
                assignmentDetails,
                lessonId
              ]
            });
          }
        }

        // Delete lessons that are no longer in the updated content
        const lessonsToDelete = existingLessonIds.filter(id => id !== null && !newLessonIds.includes(String(id)));
        
        for (const lessonId of lessonsToDelete) {
          // Delete lesson content first
          await client.execute({
            sql: 'DELETE FROM course_lesson_content WHERE lesson_id = ?',
            args: [lessonId]
          });
          
          // Delete lesson progress
          await client.execute({
            sql: 'DELETE FROM lesson_progress WHERE lesson_id = ?',
            args: [lessonId]
          });
          
          // Delete lesson
          await client.execute({
            sql: 'DELETE FROM course_lessons WHERE id = ?',
            args: [lessonId]
          });
        }
      }

      // Delete sections that are no longer in the updated content
      const sectionsToDelete = existingSectionIds.filter(id => !newSectionIds.includes(id));
      
      for (const sectionId of sectionsToDelete) {
        // Get lessons for this section
        const lessonsToDelete = await client.execute({
          sql: 'SELECT id FROM course_lessons WHERE section_id = ?',
          args: [sectionId]
        });
        
        // Delete lesson content and lessons
        for (const row of lessonsToDelete.rows) {
          const lessonId = row.id;
          
          await client.execute({
            sql: 'DELETE FROM course_lesson_content WHERE lesson_id = ?',
            args: [lessonId]
          });
          
          await client.execute({
            sql: 'DELETE FROM lesson_progress WHERE lesson_id = ?',
            args: [lessonId]
          });
          
          await client.execute({
            sql: 'DELETE FROM course_lessons WHERE id = ?',
            args: [lessonId]
          });
        }
        
        // Delete section
        await client.execute({
          sql: 'DELETE FROM course_sections WHERE id = ?',
          args: [sectionId]
        });
      }

      // Commit transaction
      await client.execute({ sql: 'COMMIT',args: [] });

      return NextResponse.json({
        success: true,
        message: 'Course content updated successfully'
      });
    } catch (error) {
      // Rollback transaction on error
      await client.execute({ sql: 'ROLLBACK', args: [] });
      throw error;
    }
  } catch (error) {
    console.error('Error updating course content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update course content',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}