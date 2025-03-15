import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// src/app/api/blog/posts/[id]/likes/route.ts

// Add a like to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      // Get the current like count
      const postData = await client.execute({
        sql: 'SELECT like_count FROM blog_posts WHERE id = ?',
        args: [id]
      });
      
      return NextResponse.json({
        success: true,
        likeCount: Number(postData.rows[0].like_count || 0),
        message: 'Post already liked'
      });
    }

    // Use a transaction to ensure data consistency
    await client.execute({ sql: 'BEGIN TRANSACTION',  args: [] });
    
    try {
      // Add the like
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
      
      // Increment the like_count in the blog_posts table
      await client.execute({
        sql: 'UPDATE blog_posts SET like_count = like_count + 1 WHERE id = ?',
        args: [id]
      });
      
      // Commit the transaction
      await client.execute({ sql: 'COMMIT', args: [] });
      
      // Get the updated count
      const postData = await client.execute({
        sql: 'SELECT like_count FROM blog_posts WHERE id = ?',
        args: [id]
      });
      
      return NextResponse.json({
        success: true,
        likeCount: Number(postData.rows[0].like_count)
      });
    } catch (error) {
      // Rollback on error
      await client.execute({ sql: 'ROLLBACK', args: [] });
      throw error;
    }
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      // Get the current like count
      const postData = await client.execute({
        sql: 'SELECT like_count FROM blog_posts WHERE id = ?',
        args: [id]
      });
      
      return NextResponse.json({
        success: true,
        likeCount: Number(postData.rows[0].like_count || 0),
        message: 'Like not found'
      });
    }

    // Use a transaction
    await client.execute({ sql: 'BEGIN TRANSACTION', args: [] });
    
    try {
      // Remove the like
      await client.execute({
        sql: 'DELETE FROM blog_post_likes WHERE post_id = ? AND user_id = ?',
        args: [id, userId]
      });
      
      // Decrement the like_count in the blog_posts table
      await client.execute({
        sql: 'UPDATE blog_posts SET like_count = MAX(0, like_count - 1) WHERE id = ?',
        args: [id]
      });
      
      // Commit the transaction
      await client.execute({ sql: 'COMMIT', args: [] });
      
      // Get the updated count
      const postData = await client.execute({
        sql: 'SELECT like_count FROM blog_posts WHERE id = ?',
        args: [id]
      });
      
      return NextResponse.json({
        success: true,
        likeCount: Number(postData.rows[0].like_count)
      });
    } catch (error) {
      // Rollback on error
      await client.execute({ sql: 'ROLLBACK', args: [] });
      throw error;
    }
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    );
  }
}