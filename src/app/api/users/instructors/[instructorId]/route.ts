// src/app/api/instructors/[instructorId]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM instructors
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

export async function PUT(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const data = await request.json();
    
    await db.execute({
      sql: `
        UPDATE instructors
        SET 
          name = ?,
          email = ?,
          bio = ?,
          contact_number = ?,
          address = ?,
          profile_image_url = ?,
          specialization = ?,
          qualification = ?,
          years_of_experience = ?,
          social_links = ?,
          status = ?
        WHERE id = ?
      `,
      args: [
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
        data.status,
        params.instructorId
      ]
    });

    return NextResponse.json({ message: 'Instructor updated successfully' });
  } catch (error) {
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
    await db.execute({
      sql: 'DELETE FROM instructors WHERE id = ?',
      args: [params.instructorId]
    });

    return NextResponse.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    );
  }
}