// src/app/api/forum/stats/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { auth, getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    // Verify database connection
    await client.execute('SELECT 1');

    // Update current user's activity if logged in
    const { userId } = getAuth(request);
    if (userId) {
      await client.execute({
        sql: `
          INSERT INTO forum_user_activity (user_id, last_active_at)
          VALUES (?, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id) DO UPDATE SET
          last_active_at = CURRENT_TIMESTAMP
        `,
        args: [userId]
      });
    }

    // Fetch forum statistics
    const statsResult = await client.execute(`
      SELECT
        (SELECT COUNT(*) FROM forum_topics) as total_topics,
        (SELECT COUNT(*) FROM forum_posts) as total_posts,
        (
          SELECT COUNT(DISTINCT user_id) 
          FROM forum_user_activity 
          WHERE last_active_at >= datetime('now', '-15 minutes')
        ) as active_users,
        (
          SELECT ua.user_id
          FROM forum_user_activity ua
          ORDER BY ua.last_active_at DESC
          LIMIT 1
        ) as latest_member_id
    `);

    // Get latest member details from Clerk if available
    let latestMember = statsResult.rows[0].latest_member_id || 'No members yet';

    // Format the statistics
    const stats = {
      totalTopics: Number(statsResult.rows[0].total_topics || 0),
      totalPosts: Number(statsResult.rows[0].total_posts || 0),
      activeUsers: Number(statsResult.rows[0].active_users || 0),
      latestMember: latestMember
    };

    // Add cache control headers for performance
    const headers = new Headers();
    headers.set('Cache-Control', 's-maxage=60'); // Cache for 1 minute

    return NextResponse.json(stats, {
      headers,
      status: 200
    });

  } catch (error) {
    console.error('Error fetching forum stats:', error);
    
    // Return default values in case of error
    return NextResponse.json({
      totalTopics: 0,
      totalPosts: 0,
      activeUsers: 0,
      latestMember: 'No members yet',
      error: 'Failed to fetch forum statistics'
    }, {
      status: 500
    });
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