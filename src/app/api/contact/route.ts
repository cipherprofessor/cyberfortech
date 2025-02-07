// src/app/api/contact/route.ts
import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  // Validate environment variables
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Database configuration missing' }, 
      { status: 500 }
    );
  }

  // Create database client
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const { name, email, phone, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Insert contact form submission
    await db.execute({
      sql: `
        INSERT INTO contacts
        (id, name, email, phone, subject, message) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        uuidv4(), 
        name, 
        email, 
        phone || null, 
        subject, 
        message
      ]
    });

    return NextResponse.json(
      { 
        message: 'Your message has been submitted successfully. We will get back to you soon!' 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' }, 
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}