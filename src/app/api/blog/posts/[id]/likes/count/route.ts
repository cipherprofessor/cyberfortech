// src/app/api/blog/posts/[id]/likes/count/route.ts

import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Get the like count for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Get the like count by counting rows in the likes table
    const result = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
      args: [id]
    });

    // Add cache control headers to prevent stale data
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, max-age=0');

    return NextResponse.json({ 
      count: Number(result.rows[0].count) 
    }, { headers });

  } catch (error) {
    console.error('Error getting like count:', error);
    return NextResponse.json(
      { error: 'Failed to get like count' },
      { status: 500 }
    );
  }
}