// src/app/api/courses/manage/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
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

// src/app/api/courses/manage/route.ts
// Update the POST function:



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