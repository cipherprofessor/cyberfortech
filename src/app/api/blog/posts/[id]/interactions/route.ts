import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Get all interactions for a post (like count, like status, bookmark status)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Note the Promise type here
) {
  try {
    const resolvedParams = await params; // Await the params
    const { id } = resolvedParams; // Now destructure from resolved params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Run queries in parallel
    const [likeCount, userInteraction] = await Promise.all([
      // Get like count
      client.execute({
        sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
        args: [id]
      }),
      
      // Get user interaction if userId is provided
      userId ? client.execute({
        sql: `
          SELECT 
            (SELECT COUNT(*) FROM blog_post_likes WHERE post_id = ? AND user_id = ?) as is_liked,
            (SELECT COUNT(*) FROM blog_post_bookmarks WHERE post_id = ? AND user_id = ?) as is_bookmarked
        `,
        args: [id, userId, id, userId]
      }) : Promise.resolve({ rows: [{ is_liked: 0, is_bookmarked: 0 }] })
    ]);

    // Set cache headers for performance
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=10, stale-while-revalidate=59');

    return NextResponse.json({
      likeCount: Number(likeCount.rows[0].count),
      isLiked: Boolean(userInteraction.rows[0].is_liked),
      isBookmarked: Boolean(userInteraction.rows[0].is_bookmarked)
    }, { headers });
  } catch (error) {
    console.error('Error getting interactions:', error);
    return NextResponse.json(
      { error: 'Failed to get interactions' },
      { status: 500 }
    );
  }
}