// src/app/api/blog/posts/[id]/likes/status/route.ts

import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Check if a user has liked a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Query both like status and count in parallel for efficiency
    const [statusResult, countResult] = await Promise.all([
      client.execute({
        sql: 'SELECT id FROM blog_post_likes WHERE post_id = ? AND user_id = ?',
        args: [id, userId]
      }),
      client.execute({
        sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
        args: [id]
      })
    ]);

    // Add cache control headers to prevent stale data
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, max-age=0');

    return NextResponse.json({ 
      isLiked: statusResult.rows.length > 0,
      likeCount: Number(countResult.rows[0].count)
    }, { headers });
    
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}