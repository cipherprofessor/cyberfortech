//src/app/api/users/instructors/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Validation schema
const instructorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  bio: z.string().nullable().optional(),
  contact_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  specialization: z.string(),
  qualification: z.string(),
  years_of_experience: z.number().min(0),
  social_links: z.record(z.string()).nullable().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).default('active')
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const countResult = await db.execute({
      sql: `
        SELECT COUNT(*) as total FROM instructors 
        WHERE status = 'active' 
        AND (name LIKE ? OR email LIKE ? OR specialization LIKE ?)
      `,
      args: [`%${search}%`, `%${search}%`, `%${search}%`]
    });

    // Get paginated results
    const result = await db.execute({
      sql: `
        SELECT 
          id,
          name,
          email,
          profile_image_url,
          specialization,
          qualification,
          rating,
          years_of_experience,
          total_courses,
          total_students,
          status,
          created_at,
          updated_at
        FROM instructors
        WHERE status = 'active'
        AND (name LIKE ? OR email LIKE ? OR specialization LIKE ?)
        ORDER BY name ASC
        LIMIT ? OFFSET ?
      `,
      args: [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset]
    });

    return NextResponse.json({
      instructors: result.rows,
      total: (countResult.rows[0] as any).total,
      page,
      totalPages: Math.ceil((countResult.rows[0] as any).total / limit)
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}


// api/users/instructors/route.ts
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = instructorSchema.parse(data);
    const id = uuidv4();

    const result = await db.execute({
      sql: `
        INSERT INTO instructors (
          id, name, email, bio, description, contact_number, 
          address, profile_image_url, specialization, 
          qualification, years_of_experience, social_links, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        validated.name,
        validated.email,
        validated.bio || null,
        validated.contact_number || null,
        validated.address || null,
        validated.profile_image_url || null,
        validated.specialization || null,
        validated.qualification || null,
        validated.years_of_experience || null,
        validated.social_links ? JSON.stringify(validated.social_links) : null,
        validated.status
      ]
    });

    return NextResponse.json({
      message: 'Instructor created successfully',
      instructor: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create instructor'
      },
      { status: 500 }
    );
  }
}