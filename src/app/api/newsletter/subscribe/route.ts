import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if email is already subscribed
    const existingSubscription = await client.execute({
      sql: 'SELECT id FROM newsletter_subscribers WHERE email = ? AND is_active = TRUE',
      args: [email]
    });
    
    if (existingSubscription.rows.length > 0) {
      return NextResponse.json(
        { message: 'Email is already subscribed' },
        { status: 200 }
      );
    }
    
    // Create new subscription
    const id = uuidv4();
    
    await client.execute({
      sql: `
        INSERT INTO newsletter_subscribers (
          id, 
          email, 
          is_active,
          subscribed_at
        ) VALUES (?, ?, TRUE, CURRENT_TIMESTAMP)
      `,
      args: [id, email]
    });
    
    return NextResponse.json({
      message: 'Successfully subscribed to newsletter'
    });
    
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}