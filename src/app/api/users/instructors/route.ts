// src/app/api/instructors/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const result = await db.execute({
        sql: `
          SELECT 
            id,
            name,
            email,
            profile_image_url,
            specialization,
            rating,
            years_of_experience,
            total_courses,
            total_students,
            status
          FROM instructors
          WHERE status = 'active'
          ORDER BY name ASC
        `,
        args: []
      });
  
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch instructors' },
        { status: 500 }
      );
    }
  }

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const result = await db.execute({
      sql: `
        INSERT INTO instructors (
          id, name, email, bio, contact_number, address,
          profile_image_url, specialization, qualification,
          years_of_experience, social_links, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        data.id,
        data.name,
        data.email,
        data.bio,
        data.contact_number,
        data.address,
        data.profile_image_url,
        data.specialization,
        data.qualification,
        data.years_of_experience,
        JSON.stringify(data.social_links),
        data.status || 'active'
      ]
    });

    return NextResponse.json({
      message: 'Instructor created successfully',
      instructorId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    );
  }
}