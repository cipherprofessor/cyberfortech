// src/app/api/forum/stats/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { auth, getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// src/app/api/forum/stats/route.ts
export async function GET(request: Request) {
  try {
    // Get basic stats without user dependency
    const statsResult = await client.execute(`
      SELECT
        (SELECT COUNT(*) FROM forum_topics WHERE is_deleted = FALSE) as total_topics,
        (SELECT COUNT(*) FROM forum_posts) as total_posts,
        (SELECT COUNT(DISTINCT author_id) 
         FROM forum_posts 
         WHERE created_at >= datetime('now', '-15 minutes')
        ) as active_users
    `);

    return NextResponse.json({
      totalTopics: statsResult.rows[0].total_topics,
      totalPosts: statsResult.rows[0].total_posts,
      activeUsers: statsResult.rows[0].active_users,
      latestMember: 'N/A' // We'll update this once we have users
    });
  } catch (error) {
    console.error('Error fetching forum stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// Add a route to manually update user activity
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update user's last active timestamp
    await client.execute({
      sql: `
        INSERT INTO forum_user_activity (user_id, last_active_at)
        VALUES (?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
        last_active_at = CURRENT_TIMESTAMP
      `,
      args: [userId]
    });

    return NextResponse.json({
      message: 'Activity updated successfully'
    });

  } catch (error) {
    console.error('Error updating user activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}