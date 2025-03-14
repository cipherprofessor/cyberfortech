import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Add a bookmark
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

    // Check if the post exists
    const postCheck = await client.execute({
      sql: 'SELECT id FROM blog_posts WHERE id = ? AND is_deleted = FALSE',
      args: [id]
    });

    if (postCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already bookmarked the post
    const existingBookmark = await client.execute({
      sql: 'SELECT id FROM blog_post_bookmarks WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });

    if (existingBookmark.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already bookmarked this post' },
        { status: 400 }
      );
    }

    // Add the bookmark
    const bookmarkId = uuidv4();
    await client.execute({
      sql: `
        INSERT INTO blog_post_bookmarks (
          id,
          post_id,
          user_id,
          created_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [bookmarkId, id, userId]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to add bookmark' },
      { status: 500 }
    );
  }
}

// Remove a bookmark
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

    // Check if the bookmark exists
    const existingBookmark = await client.execute({
      sql: 'SELECT id FROM blog_post_bookmarks WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });

    if (existingBookmark.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    // Remove the bookmark
    await client.execute({
      sql: 'DELETE FROM blog_post_bookmarks WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}