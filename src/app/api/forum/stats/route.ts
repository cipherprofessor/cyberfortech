// src/app/api/forum/stats/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: Request) {
  try {
    // Get basic stats
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
      latestMember: 'N/A'
    });
  } catch (error) {
    console.error('Error fetching forum stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request as any);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First, check if user exists in the database
    const userExists = await client.execute({
      sql: 'SELECT id FROM users WHERE id = ?',
      args: [userId]
    });

    if (!userExists.rows.length) {
      // User doesn't exist, fetch from Clerk and create
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);
      
      // Insert user into database
      await client.execute({
        sql: `
          INSERT INTO users (
            id, 
            email,
            first_name,
            last_name,
            full_name,
            avatar_url,
            role,
            email_verified,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [
          userId,
          clerkUser.emailAddresses[0]?.emailAddress || '',
          clerkUser.firstName || '',
          clerkUser.lastName || '',
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          clerkUser.imageUrl || '',
          String(clerkUser.publicMetadata?.role || 'student'),
          clerkUser.emailAddresses[0]?.emailAddress || ''
        ]
      });

      // Create initial forum user stats
      await client.execute({
        sql: `
          INSERT INTO forum_user_stats (
            user_id,
            total_posts,
            total_topics,
            reputation_points,
            created_at,
            updated_at
          ) VALUES (?, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [userId]
      });
    }

    // Update user activity in forum_user_stats instead
    await client.execute({
      sql: `
        UPDATE forum_user_stats 
        SET last_active_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `,
      args: [userId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user activity:', error);
    return NextResponse.json(
      { error: 'Failed to update user activity' },
      { status: 500 }
    );
  }
}