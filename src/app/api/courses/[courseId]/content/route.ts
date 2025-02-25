// src/app/api/courses/[courseId]/content/route.ts
// Complete version with lessons processing

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Initialize database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
});

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

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  console.log("POST request received for course content");
  
  try {
    // 1. Params handling
    const resolvedParams = await Promise.resolve(params);
    const courseId = resolvedParams.courseId;
    console.log("Course ID:", courseId);
    
    if (!courseId || typeof courseId !== 'string') {
      console.log("Invalid course ID");
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // 2. Request body
    let requestData: CourseContentRequest;
    try {
      requestData = await request.json();
      console.log("Request data received");
    } catch (jsonError) {
      console.error("Failed to parse request JSON:", jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // 3. Database check to see if course exists
    let courseCheck;
    try {
      courseCheck = await client.execute({
        sql: 'SELECT id, instructor_id FROM courses WHERE id = ?',
        args: [courseId]
      });
      console.log("Course check result:", courseCheck.rows);
    } catch (dbError) {
      console.error("Database error during course check:", dbError);
      return NextResponse.json(
        { error: 'Database error', details: String(dbError) },
        { status: 500 }
      );
    }

    if (!courseCheck || courseCheck.rows.length === 0) {
      console.log("Course not found");
      return NextResponse.json({
        error: 'Course not found',
        courseId
      }, { status: 404 });
    }
    
    const { courseContent, sections } = requestData;
    const instructorId = courseCheck.rows[0].instructor_id;
    
    // Handle each operation separately without transactions
    
    // Step 1: Handle course content
    try {
      console.log("Handling course content");
      
      // Check if course content exists
      const contentCheck = await client.execute({
        sql: 'SELECT id FROM course_content WHERE course_id = ?',
        args: [courseId]
      });
      
      if (contentCheck.rows.length === 0) {
        // Create new course content
        const contentId = uuidv4();
        console.log("Creating new course content with ID:", contentId);
        
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
            contentId,
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
        
        console.log("Course content created successfully");
      } else {
        // Update existing course content
        console.log("Updating existing course content");
        
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
        
        console.log("Course content updated successfully");
      }
    } catch (error) {
      console.error("Error handling course content:", error);
      return NextResponse.json(
        { error: 'Failed to save course content', details: String(error) },
        { status: 500 }
      );
    }
    
    // Step 2: Process sections and lessons
    try {
      console.log(`Processing ${sections.length} sections`);
      
      // Get existing sections
      const existingSections = await client.execute({
        sql: 'SELECT id, sequence_number FROM course_sections WHERE course_id = ?',
        args: [courseId]
      });
      
      // Create a map with proper types
      const existingSectionMap: Record<string, string> = {};
      
      // Track which sections we process to know which ones to delete later
      const processedSectionIds: string[] = [];
      
      // Populate the map with existing section IDs, using sequence_number as string keys
      for (const row of existingSections.rows) {
        if (row.sequence_number !== null && row.id !== null) {
          existingSectionMap[String(row.sequence_number)] = String(row.id);
        }
      }
      
      // Process each section
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sequenceNumber = section.sequence_number;
        
        let sectionId: string;
        
        // Check if section exists by sequence number
        if (existingSectionMap[String(sequenceNumber)]) {
          // Update existing section
          sectionId = existingSectionMap[String(sequenceNumber)];
          console.log(`Updating section with ID: ${sectionId}`);
          
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
        } else {
          // Create new section
          sectionId = uuidv4();
          console.log(`Creating new section with ID: ${sectionId}`);
          
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
              sequenceNumber
            ]
          });
        }
        
        // Add to processed sections
        processedSectionIds.push(sectionId);
        
        // Process lessons for this section
        await processLessons(sectionId, section.lessons);
      }
      
      // Clean up any sections that are no longer in the updated content
      await deleteUnusedSections(courseId, processedSectionIds);
      
      console.log("All sections and lessons processed successfully");
    } catch (error) {
      console.error("Error processing sections:", error);
      return NextResponse.json(
        { error: 'Failed to save course sections', details: String(error) },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Course content updated successfully'
    });
    
  } catch (error) {
    console.error("Unhandled error in course content POST handler:", error);
    return NextResponse.json(
      { 
        error: 'Failed to process course content request',
        details: String(error)
      },
      { status: 500 }
    );
  }
}

// Helper function to process lessons for a section
async function processLessons(sectionId: string, lessons: any[]) {
  console.log(`Processing ${lessons.length} lessons for section ${sectionId}`);
  
  // Get existing lessons for this section
  const existingLessons = await client.execute({
    sql: 'SELECT id, sequence_number FROM course_lessons WHERE section_id = ?',
    args: [sectionId]
  });
  
  // Create a map for existing lessons
  const existingLessonMap: Record<string, string> = {};
  
  // Track which lessons we process to know which ones to delete later
  const processedLessonIds: string[] = [];
  
  // Populate the lesson map
  for (const row of existingLessons.rows) {
    if (row.sequence_number !== null && row.id !== null) {
      existingLessonMap[String(row.sequence_number)] = String(row.id);
    }
  }
  
  // Process each lesson
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const sequenceNumber = lesson.sequence_number;
    
    let lessonId: string;
    
    // Check if lesson exists by sequence number
    if (existingLessonMap[String(sequenceNumber)]) {
      // Update existing lesson
      lessonId = existingLessonMap[String(sequenceNumber)];
      console.log(`Updating lesson with ID: ${lessonId}`);
      
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
    } else {
      // Create new lesson
      lessonId = uuidv4();
      console.log(`Creating new lesson with ID: ${lessonId}`);
      
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
          sequenceNumber
        ]
      });
    }
    
    // Add to processed lessons
    processedLessonIds.push(lessonId);
    
    // Process lesson content
    await processLessonContent(lessonId, lesson.content_type, lesson.content);
  }
  
  // Clean up any lessons that are no longer in the updated content
  await deleteUnusedLessons(sectionId, processedLessonIds);
}

// Helper function to process lesson content
async function processLessonContent(lessonId: string, contentType: string, content: any) {
  console.log(`Processing content for lesson ${lessonId}`);
  
  // Check if lesson content exists
  const contentCheck = await client.execute({
    sql: 'SELECT id FROM course_lesson_content WHERE lesson_id = ?',
    args: [lessonId]
  });
  
  // Prepare content fields based on lesson type
  let videoUrl: string | null = null;
  let articleContent: string | null = null;
  let quizData: string | null = null;
  let assignmentDetails: string | null = null;
  
  if (contentType === 'video' && content.video_url) {
    videoUrl = content.video_url;
  } else if (contentType === 'article' && content.article_content) {
    articleContent = content.article_content;
  } else if (contentType === 'quiz' && content.quiz_data) {
    quizData = JSON.stringify(content.quiz_data);
  } else if (contentType === 'assignment' && content.assignment_details) {
    assignmentDetails = JSON.stringify(content.assignment_details);
  }
  
  if (contentCheck.rows.length === 0) {
    // Create new lesson content
    const contentId = uuidv4();
    
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
        contentId,
        lessonId,
        contentType,
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
        contentType,
        videoUrl,
        articleContent,
        quizData,
        assignmentDetails,
        lessonId
      ]
    });
  }
}

// Helper function to clean up sections that are no longer in the content
async function deleteUnusedSections(courseId: string, processedSectionIds: string[]) {
  console.log("Cleaning up unused sections");
  
  // Get all sections for this course
  const allSections = await client.execute({
    sql: 'SELECT id FROM course_sections WHERE course_id = ?',
    args: [courseId]
  });
  
  // Find sections to delete
  for (const row of allSections.rows) {
    const sectionId = String(row.id);
    
    if (!processedSectionIds.includes(sectionId)) {
      console.log(`Deleting unused section: ${sectionId}`);
      
      // First clean up all lessons and their content
      await deleteAllLessonsForSection(sectionId);
      
      // Then delete the section
      await client.execute({
        sql: 'DELETE FROM course_sections WHERE id = ?',
        args: [sectionId]
      });
    }
  }
}

// Helper function to clean up lessons that are no longer in the content
async function deleteUnusedLessons(sectionId: string, processedLessonIds: string[]) {
  console.log("Cleaning up unused lessons for section", sectionId);
  
  // Get all lessons for this section
  const allLessons = await client.execute({
    sql: 'SELECT id FROM course_lessons WHERE section_id = ?',
    args: [sectionId]
  });
  
  // Find lessons to delete
  for (const row of allLessons.rows) {
    const lessonId = String(row.id);
    
    if (!processedLessonIds.includes(lessonId)) {
      console.log(`Deleting unused lesson: ${lessonId}`);
      
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
}

// Helper function to delete all lessons for a section
async function deleteAllLessonsForSection(sectionId: string) {
  console.log(`Deleting all lessons for section: ${sectionId}`);
  
  // Get all lessons for this section
  const lessons = await client.execute({
    sql: 'SELECT id FROM course_lessons WHERE section_id = ?',
    args: [sectionId]
  });
  
  // Delete each lesson
  for (const row of lessons.rows) {
    const lessonId = String(row.id);
    
    // Delete lesson content
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

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Process params
    const resolvedParams = await Promise.resolve(params);
    const courseId = resolvedParams.courseId;
    console.log("GET request for course content, ID:", courseId);
    
    if (!courseId || typeof courseId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Get user ID from headers
    const headersList = headers();
    const userId = (await headersList).get('x-user-id') || '';

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

    // Fetch sections
    const sections = await client.execute({
      sql: `
        SELECT 
          cs.id,
          cs.title,
          cs.description,
          cs.sequence_number
        FROM course_sections cs
        WHERE cs.course_id = ?
        ORDER BY cs.sequence_number
      `,
      args: [courseId]
    });

    // Fetch all lessons for this course
    const lessons = await client.execute({
      sql: `
        SELECT 
          cl.id,
          cl.section_id,
          cl.title,
          cl.description,
          cl.content_type,
          cl.duration,
          cl.is_free_preview,
          cl.sequence_number,
          COALESCE(
            (SELECT completion_status 
            FROM lesson_progress 
            WHERE lesson_id = cl.id 
            AND user_id = ?),
            'not_started'
          ) as progress
        FROM course_lessons cl
        JOIN course_sections cs ON cl.section_id = cs.id
        WHERE cs.course_id = ?
        ORDER BY cs.sequence_number, cl.sequence_number
      `,
      args: [userId, courseId]
    });

    // Fetch lesson content
    const lessonContent = await client.execute({
      sql: `
        SELECT 
          clc.lesson_id,
          clc.content_type,
          clc.video_url,
          clc.article_content,
          clc.quiz_data,
          clc.assignment_details
        FROM course_lesson_content clc
        JOIN course_lessons cl ON clc.lesson_id = cl.id
        JOIN course_sections cs ON cl.section_id = cs.id
        WHERE cs.course_id = ?
      `,
      args: [courseId]
    });

    // Group lessons by section
    // Replace the content-related part in the GET handler with this code:

// Group lessons by section
const lessonsBySection: Record<string, any[]> = {};
for (const lesson of lessons.rows) {
  const sectionId = String(lesson.section_id);
  if (!lessonsBySection[sectionId]) {
    lessonsBySection[sectionId] = [];
  }
  
  // Find content for this lesson
  const content = lessonContent.rows.find((c: any) => String(c.lesson_id) === String(lesson.id));
  
  // Safely handle content parsing
  let parsedQuizData = null;
  let parsedAssignmentDetails = null;
  
  if (content) {
    if (content.quiz_data && typeof content.quiz_data === 'string') {
      try {
        parsedQuizData = JSON.parse(content.quiz_data);
      } catch (e) {
        console.error('Error parsing quiz data:', e);
      }
    }
    
    if (content.assignment_details && typeof content.assignment_details === 'string') {
      try {
        parsedAssignmentDetails = JSON.parse(content.assignment_details);
      } catch (e) {
        console.error('Error parsing assignment details:', e);
      }
    }
  }
  
  lessonsBySection[sectionId].push({
    id: String(lesson.id),
    title: lesson.title,
    description: lesson.description,
    contentType: lesson.content_type,
    duration: lesson.duration,
    isFreePreview: Boolean(lesson.is_free_preview),
    sequenceNumber: lesson.sequence_number,
    progress: lesson.progress,
    content: content ? {
      videoUrl: content.video_url,
      articleContent: content.article_content,
      quizData: parsedQuizData,
      assignmentDetails: parsedAssignmentDetails
    } : {}
  });
}

    // Format the sections with their lessons
    const formattedSections = sections.rows.map((section: any) => ({
      id: String(section.id),
      title: section.title,
      description: section.description,
      sequence_number: section.sequence_number,
      lessons: lessonsBySection[String(section.id)] || []
    }));

    // Format the response
    const response = {
      courseContent: courseContent.rows[0] || {},
      sections: formattedSections
    };

    // Parse JSON strings if they exist
    if (response.courseContent.learning_objectives && typeof response.courseContent.learning_objectives === 'string') {
      response.courseContent.learning_objectives = JSON.parse(response.courseContent.learning_objectives);
    }
    
    if (response.courseContent.prerequisites && typeof response.courseContent.prerequisites === 'string') {
      response.courseContent.prerequisites = JSON.parse(response.courseContent.prerequisites);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching course content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch course content',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}