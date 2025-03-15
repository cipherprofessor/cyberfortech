//src/app/api/blog/posts/[id]/likes/count/route.ts
import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Get the like count for a post
// src/app/api/blog/posts/[id]/likes/count/route.ts

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Note the Promise type here
) {
  try {
    const resolvedParams = await params; // Await the params
    const { id } = resolvedParams; // Now destructure from resolved params

    // Get the like count from the blog_posts table directly
    const result = await client.execute({
      sql: 'SELECT like_count FROM blog_posts WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ 
      count: Number(result.rows[0].like_count || 0) 
    });
  } catch (error) {
    console.error('Error getting like count:', error);
    return NextResponse.json(
      { error: 'Failed to get like count' },
      { status: 500 }
    );
  }
}