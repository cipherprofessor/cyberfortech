// src/app/api/training/courses/[courseId]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface CourseUpdateBody {
  title?: string;
  description?: string;
  dates?: string;
  time?: string;
  duration?: string;
  mode?: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor?: string;
  maxCapacity?: number;
  price?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  prerequisites?: string[];
  certification?: string;
  language?: string;
  isActive?: boolean;
}

// GET a specific course by ID
export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    
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
          is_active as isActive,
          created_at as createdAt,
          updated_at as updatedAt
        FROM training_courses
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [courseId]
    });
    
    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const course = {
      ...result.rows[0],
      // Parse JSON strings to arrays
      prerequisites: result.rows[0].prerequisites ? JSON.parse(String(result.rows[0].prerequisites)) : [],
      // Calculate availability
      availability: Number(result.rows[0].maxCapacity) - Number(result.rows[0].currentEnrollment),
      // Convert numeric fields
      price: Number(result.rows[0].price),
      maxCapacity: Number(result.rows[0].maxCapacity),
      currentEnrollment: Number(result.rows[0].currentEnrollment),
      isActive: Boolean(result.rows[0].isActive)
    };
    
    return NextResponse.json(course);
    
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// UPDATE a course (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { courseId } = params;
    const body = await request.json() as CourseUpdateBody;
    
    // Check if course exists
    const courseExists = await client.execute({
      sql: 'SELECT id, current_enrollment FROM training_courses WHERE id = ? AND is_deleted = FALSE',
      args: [courseId]
    });
    
    if (!courseExists.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const currentEnrollment = Number(courseExists.rows[0].current_enrollment);
    
    // Validate max capacity if updating
    if (body.maxCapacity !== undefined && body.maxCapacity < currentEnrollment) {
      return NextResponse.json(
        { error: 'Maximum capacity cannot be less than current enrollment' },
        { status: 400 }
      );
    }
    
    // Validate mode if updating
    if (body.mode && !['online', 'in-person', 'hybrid'].includes(body.mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be online, in-person, or hybrid' },
        { status: 400 }
      );
    }
    
    // Validate level if updating
    if (body.level && !['beginner', 'intermediate', 'advanced'].includes(body.level)) {
      return NextResponse.json(
        { error: 'Invalid level. Must be beginner, intermediate, or advanced' },
        { status: 400 }
      );
    }
    
    // Build update SQL
    const updates: string[] = [];
    const queryParams: any[] = [];
    
    // Helper function to add a field to the update
    const addField = (fieldName: string, value: any, dbFieldName?: string) => {
      if (value !== undefined) {
        updates.push(`${dbFieldName || fieldName} = ?`);
        queryParams.push(value);
      }
    };
    
    // Add all possible fields
    addField('title', body.title);
    addField('description', body.description);
    addField('dates', body.dates);
    addField('time', body.time);
    addField('duration', body.duration);
    addField('mode', body.mode);
    addField('location', body.location);
    addField('instructor', body.instructor);
    addField('maxCapacity', body.maxCapacity, 'max_capacity');
    addField('price', body.price);
    addField('level', body.level);
    addField('category', body.category);
    addField('prerequisites', body.prerequisites ? JSON.stringify(body.prerequisites) : undefined);
    addField('certification', body.certification);
    addField('language', body.language);
    addField('isActive', body.isActive !== undefined ? (body.isActive ? 1 : 0) : undefined, 'is_active');
    
    // Only proceed if there are fields to update
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    // Build and execute the update query
    await client.execute({
      sql: `
        UPDATE training_courses
        SET ${updates.join(', ')}
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [...queryParams, courseId]
    });
    
    // Fetch the updated course
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
          is_active as isActive,
          created_at as createdAt,
          updated_at as updatedAt
        FROM training_courses
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [courseId]
    });
    
    const updatedCourse = {
      ...result.rows[0],
      prerequisites: result.rows[0].prerequisites ? JSON.parse(String(result.rows[0].prerequisites)) : [],
      availability: Number(result.rows[0].maxCapacity) - Number(result.rows[0].currentEnrollment),
      price: Number(result.rows[0].price),
      maxCapacity: Number(result.rows[0].maxCapacity),
      currentEnrollment: Number(result.rows[0].currentEnrollment),
      isActive: Boolean(result.rows[0].isActive)
    };
    
    return NextResponse.json(updatedCourse);
    
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE a course (admin only, soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { courseId } = params;
    
    // Check if course exists
    const courseExists = await client.execute({
      sql: 'SELECT id FROM training_courses WHERE id = ? AND is_deleted = FALSE',
      args: [courseId]
    });
    
    if (!courseExists.rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Check if course has active enrollments
    const activeEnrollments = await client.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM training_enrollments
        WHERE course_id = ? AND is_deleted = FALSE AND status IN ('confirmed', 'pending')
      `,
      args: [courseId]
    });
    
    if (Number(activeEnrollments.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course with active enrollments' },
        { status: 400 }
      );
    }
    
    // Soft delete the course
    await client.execute({
      sql: `
        UPDATE training_courses
        SET 
          is_deleted = TRUE,
          deleted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [courseId]
    });
    
    return NextResponse.json({
      message: 'Course deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}