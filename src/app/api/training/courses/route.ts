// src/app/api/training/courses/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface CourseBody {
  title: string;
  description: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor: string;
  maxCapacity: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  prerequisites?: string[];
  certification?: string;
  language: string;
}

// GET all courses with pagination and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Filtering parameters
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const mode = searchParams.get('mode');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const instructor = searchParams.get('instructor');
    const search = searchParams.get('search');
    
    // Build WHERE clause
    let whereClause = 'WHERE is_deleted = FALSE AND is_active = TRUE';
    const queryParams: any[] = [];
    
    if (level) {
      whereClause += ' AND level = ?';
      queryParams.push(level);
    }
    
    if (category) {
      whereClause += ' AND category = ?';
      queryParams.push(category);
    }
    
    if (mode) {
      whereClause += ' AND mode = ?';
      queryParams.push(mode);
    }
    
    if (instructor) {
      whereClause += ' AND instructor LIKE ?';
      queryParams.push(`%${instructor}%`);
    }
    
    if (search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // Get total count
    const countResult = await client.execute({
      sql: `
        SELECT COUNT(*) as total 
        FROM training_courses 
        ${whereClause}
      `,
      args: queryParams
    });
    
    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    // Get courses
    const result = await client.execute({
      sql: `
        SELECT 
          id,
          title,
          description,
          dates,
          time,
          duration,
          mode,
          location,
          instructor,
          max_capacity as maxCapacity,
          current_enrollment as currentEnrollment,
          price,
          level,
          category,
          prerequisites,
          certification,
          language,
          created_at as createdAt,
          updated_at as updatedAt
        FROM training_courses
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [...queryParams, limit, offset]
    });
    
    const courses = result.rows.map(row => ({
      ...row,
      // Parse JSON strings to arrays
      prerequisites: row.prerequisites ? JSON.parse(row.prerequisites) : [],
      // Calculate availability
      availability: Number(row.maxCapacity) - Number(row.currentEnrollment),
      // Convert prices to numbers
      price: Number(row.price)
    }));
    
    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// Create a new course (admin only)
export async function POST(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const body = await request.json() as CourseBody;
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'dates', 'time', 'duration',
      'mode', 'instructor', 'maxCapacity', 'price', 'level',
      'category', 'language'
    ];
    
    for (const field of requiredFields) {
      if (!body[field as keyof CourseBody]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate mode
    if (!['online', 'in-person', 'hybrid'].includes(body.mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be online, in-person, or hybrid' },
        { status: 400 }
      );
    }
    
    // Validate level
    if (!['beginner', 'intermediate', 'advanced'].includes(body.level)) {
      return NextResponse.json(
        { error: 'Invalid level. Must be beginner, intermediate, or advanced' },
        { status: 400 }
      );
    }
    
    // Generate unique ID
    const courseId = nanoid();
    
    // Convert arrays to JSON strings for storage
    const prerequisites = body.prerequisites ? JSON.stringify(body.prerequisites) : null;
    
    // Insert the course
    await client.execute({
      sql: `
        INSERT INTO training_courses (
          id,
          title,
          description,
          dates,
          time,
          duration,
          mode,
          location,
          instructor,
          max_capacity,
          price,
          level,
          category,
          prerequisites,
          certification,
          language,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        courseId,
        body.title,
        body.description,
        body.dates,
        body.time,
        body.duration,
        body.mode,
        body.location || null,
        body.instructor,
        body.maxCapacity,
        body.price,
        body.level,
        body.category,
        prerequisites,
        body.certification || null,
        body.language
      ]
    });
    
    // Return the created course
    const course = {
      id: courseId,
      ...body,
      currentEnrollment: 0,
      availability: body.maxCapacity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(course, { status: 201 });
    
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}