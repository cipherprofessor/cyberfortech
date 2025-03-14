import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Check if a user has bookmarked a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if the user has bookmarked the post
    const result = await client.execute({
      sql: 'SELECT id FROM blog_post_bookmarks WHERE post_id = ? AND user_id = ?',
      args: [id, userId]
    });

    return NextResponse.json({ 
      isBookmarked: result.rows.length > 0 
    });

  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    );
  }
}