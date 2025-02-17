//src/app/api/users/instructors/[instructorId]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  bio: z.string().nullable().optional(),
  contact_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  years_of_experience: z.number().min(0).optional(),
  social_links: z.record(z.string()).nullable().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional()
});

export async function GET(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          id, name, email, bio, contact_number, address,
          profile_image_url, specialization, qualification,
          years_of_experience, rating, total_students,
          total_courses, social_links, status,
          created_at, updated_at
        FROM instructors
        WHERE id = ?
      `,
      args: [params.instructorId]
    });

    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching instructor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const data = await request.json();
    const validated = updateSchema.parse(data);

    // Filter out undefined values and build update query
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(validated).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value === null ? null : value);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: `
        UPDATE instructors
        SET ${updates.join(', ')}
        WHERE id = ?
        RETURNING *
      `,
      args: [...values, params.instructorId] as const
    });

    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Instructor updated successfully',
      instructor: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to update instructor' },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    // Soft delete by updating status
    const result = await db.execute({
      sql: `
        UPDATE instructors 
        SET status = 'inactive' 
        WHERE id = ?
        RETURNING id
      `,
      args: [params.instructorId]
    });

    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Instructor deleted successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    );
  }
}