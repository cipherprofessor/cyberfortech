// src/app/api/blog/posts/[id]/likes/route.ts

import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Add a like to a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already liked the post
    const existingLike = await client.execute({
      sql: 'SELECT id FROM blog_post_likes WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });

    if (existingLike.rows.length > 0) {
      // Already liked - get current count and return
      const likeCount = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
        args: [id]
      });
      
      return NextResponse.json({
        success: true,
        likeCount: Number(likeCount.rows[0].count),
        isLiked: true,
        message: 'Already liked'
      });
    }

    // Add the like - no transaction needed for this simple operation
    const likeId = uuidv4();
    await client.execute({
      sql: `
        INSERT INTO blog_post_likes (
          id,
          post_id,
          user_id,
          created_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [likeId, id, userId]
    });
    
    // Get the updated like count
    const likeCount = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
      args: [id]
    });

    return NextResponse.json({
      success: true,
      likeCount: Number(likeCount.rows[0].count),
      isLiked: true
    });

  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json(
      { error: 'Failed to add like' },
      { status: 500 }
    );
  }
}

// Remove a like from a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if the like exists
    const existingLike = await client.execute({
      sql: 'SELECT id FROM blog_post_likes WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });

    if (existingLike.rows.length === 0) {
      // Not liked - get current count and return
      const likeCount = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
        args: [id]
      });
      
      return NextResponse.json({
        success: true,
        likeCount: Number(likeCount.rows[0].count),
        isLiked: false,
        message: 'Not liked'
      });
    }

    // Remove the like - no transaction needed
    await client.execute({
      sql: 'DELETE FROM blog_post_likes WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });
    
    // Get the updated like count
    const likeCount = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
      args: [id]
    });

    return NextResponse.json({
      success: true,
      likeCount: Number(likeCount.rows[0].count),
      isLiked: false
    });

  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    );
  }
}