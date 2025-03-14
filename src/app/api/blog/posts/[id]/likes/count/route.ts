import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Get the like count for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the like count
    const result = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
      args: [id]
    });

    return NextResponse.json({ 
      count: Number(result.rows[0].count) 
    });

  } catch (error) {
    console.error('Error getting like count:', error);
    return NextResponse.json(
      { error: 'Failed to get like count' },
      { status: 500 }
    );
  }
}