// src/app/api/courses/manage/route.ts
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Helper function to safely convert rows to courses
const mapRowsToCourses = (rows: any[]) => {
 return rows.map(row => ({
   id: row.id || uuidv4(), // Fallback to new UUID if none exists
   title: row.title,
   description: row.description,
   price: Number(row.price),
   duration: row.duration,
   level: row.level,
   category: row.category,
   instructor_id: row.instructor_id,
   instructor_name: row.instructor_name,
   instructor_profile_image_url: row.instructor_profile_image_url,
   image_url: row.image_url,
   total_students: Number(row.total_students || 0),
   total_reviews: Number(row.total_reviews || 0),
   average_rating: row.average_rating ? Number(row.average_rating) : 0,
   created_at: row.created_at,
   updated_at: row.updated_at
 }));
};

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

   const courses = mapRowsToCourses(result.rows);
   return NextResponse.json(courses);

 } catch (error) {
   console.error('Error fetching courses:', error);
   return NextResponse.json(
     { error: 'Failed to fetch courses' },
     { status: 500 }
   );
 }
}


export async function POST(request: Request) {
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

    // Generate a new UUID for the course
    const courseId = uuidv4();
    console.log('Generated UUID:', courseId); // Debug log

    // Get current timestamp
    const now = new Date().toISOString();

    // Log the data being inserted
    console.log('Inserting course with data:', {
      courseId,
      title,
      description,
      image_url,
      price,
      duration,
      level,
      category,
      instructor_id,
      now
    });

    const result = await db.execute({
      sql: `
        INSERT INTO courses (
          id,
          title,
          description,
          image_url,
          price,
          duration,
          level,
          instructor_id,
          category,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        courseId,
        title,
        description,
        image_url,
        price,
        duration,
        level,
        instructor_id,
        category,
        now,
        now
      ]
    });

    // Log the result
    console.log('Insert result:', result);

    // Verify the insertion by fetching the course
    const verifyInsert = await db.execute({
      sql: 'SELECT * FROM courses WHERE id = ?',
      args: [courseId]
    });

    console.log('Verification query result:', verifyInsert.rows[0]); // Debug log

    // Fetch the complete course details
    const newCourse = await db.execute({
      sql: `
        SELECT 
          c.*,
          i.name as instructor_name,
          i.profile_image_url as instructor_profile_image_url,
          COALESCE((SELECT COUNT(*) FROM enrollments WHERE course_id = c.id), 0) as total_students,
          COALESCE((SELECT COUNT(*) FROM course_reviews WHERE course_id = c.id), 0) as total_reviews,
          COALESCE(c.average_rating, 0) as average_rating
        FROM courses c
        LEFT JOIN instructors i ON c.instructor_id = i.id
        WHERE c.id = ?
      `,
      args: [courseId]
    });

    if (!newCourse.rows.length) {
      throw new Error('Failed to fetch created course');
    }

    const createdCourse = mapRowsToCourses(newCourse.rows)[0];

    return NextResponse.json({ 
      message: 'Course created successfully',
      course: createdCourse,
      courseId
    });

  } catch (error) {
    console.error('Error creating course:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

// Add this debug endpoint temporarily
export async function GETv2() {
  try {
    // First, check table structure
    const tableInfo = await db.execute({
      sql: `PRAGMA table_info(courses);`,
      args: []
    });
    console.log('Table structure:', tableInfo.rows);

    // Then get the courses
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

    return NextResponse.json({
      tableInfo: tableInfo.rows,
      courses: result.rows
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Always await params before using them
    const resolvedParams = await Promise.resolve(params);
    const courseId = resolvedParams.courseId;
    
    console.log("Updating course with ID:", courseId);
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const courseCheck = await db.execute({
      sql: 'SELECT id FROM courses WHERE id = ?',
      args: [courseId]
    });
    
    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Get update data
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
    
    // Update the course
    const result = await db.execute({
      sql: `
        UPDATE courses SET
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
    
    console.log("Update result:", result);
    
    return NextResponse.json({
      success: true, 
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Always await params before using them
    const resolvedParams = await Promise.resolve(params);
    const courseId = resolvedParams.courseId;
    
    console.log("Deleting course with ID:", courseId);
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const courseCheck = await db.execute({
      sql: 'SELECT id FROM courses WHERE id = ?',
      args: [courseId]
    });
    
    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // In a real application, you might want to:
    // 1. First delete related records (enrollments, reviews, content, sections, lessons)
    // 2. Then delete the course itself
    
    // For example, delete course content first
    await db.execute({
      sql: 'DELETE FROM course_content WHERE course_id = ?',
      args: [courseId]
    });
    
    // Delete course sections and lessons
    const sections = await db.execute({
      sql: 'SELECT id FROM course_sections WHERE course_id = ?',
      args: [courseId]
    });
    
    for (const section of sections.rows) {
      const sectionId = String(section.id);
      
      // Delete lessons for this section
      const lessons = await db.execute({
        sql: 'SELECT id FROM course_lessons WHERE section_id = ?',
        args: [sectionId]
      });
      
      for (const lesson of lessons.rows) {
        const lessonId = String(lesson.id);
        
        // Delete lesson content
        await db.execute({
          sql: 'DELETE FROM course_lesson_content WHERE lesson_id = ?',
          args: [lessonId]
        });
        
        // Delete lesson progress
        await db.execute({
          sql: 'DELETE FROM lesson_progress WHERE lesson_id = ?',
          args: [lessonId]
        });
        
        // Delete lesson
        await db.execute({
          sql: 'DELETE FROM course_lessons WHERE id = ?',
          args: [lessonId]
        });
      }
      
      // Delete section
      await db.execute({
        sql: 'DELETE FROM course_sections WHERE id = ?',
        args: [sectionId]
      });
    }
    
    // Delete enrollments
    await db.execute({
      sql: 'DELETE FROM enrollments WHERE course_id = ?',
      args: [courseId]
    });
    
    // Delete reviews
    await db.execute({
      sql: 'DELETE FROM course_reviews WHERE course_id = ?',
      args: [courseId]
    });
    
    // Finally, delete the course
    await db.execute({
      sql: 'DELETE FROM courses WHERE id = ?',
      args: [courseId]
    });
    
    return NextResponse.json({
      success: true,
      message: 'Course and related data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course', details: String(error) },
      { status: 500 }
    );
  }
}


// Add validation middleware (optional but recommended)
export async function middleware(request: Request) {
 if (request.method === 'POST') {
   const data = await request.json();
   
   // Basic validation
   const requiredFields = ['title', 'description', 'price', 'level', 'category', 'instructor_id'];
   const missingFields = requiredFields.filter(field => !data[field]);
   
   if (missingFields.length > 0) {
     return NextResponse.json(
       { error: `Missing required fields: ${missingFields.join(', ')}` },
       { status: 400 }
     );
   }

   // Validate level
   const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
   if (!validLevels.includes(data.level)) {
     return NextResponse.json(
       { error: 'Invalid level. Must be one of: Beginner, Intermediate, Advanced' },
       { status: 400 }
     );
   }

   // Validate price
   if (typeof data.price !== 'number' || data.price < 0) {
     return NextResponse.json(
       { error: 'Price must be a non-negative number' },
       { status: 400 }
     );
   }
 }
}