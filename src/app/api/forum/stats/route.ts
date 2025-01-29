// src/app/api/forum/stats/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    // Initialize default response
    const defaultStats = {
      totalTopics: 0,
      totalPosts: 0,
      activeUsers: 0,
      latestMember: 'No members yet'
    };

    // Check if tables exist before querying
    const tablesExist = await client.execute(`
      SELECT COUNT(*) as count 
      FROM sqlite_master 
      WHERE type='table' 
      AND name IN ('forum_topics', 'forum_posts', 'forum_user_stats')
    `);

    const tableCount = tablesExist.rows[0]?.count;
    if (typeof tableCount === 'number' && tableCount < 3) {
      return NextResponse.json({
        ...defaultStats,
        message: 'Some tables are missing. Please run database migrations.'
      });
    }

    // Get total topics
    const topicsCount = await client.execute('SELECT COUNT(*) as count FROM forum_topics');
    
    // Get total posts
    const postsCount = await client.execute('SELECT COUNT(*) as count FROM forum_posts');
    
    // Get active users (modified query to use last_active_at)
    const activeUsers = await client.execute(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM forum_user_stats 
      WHERE last_active_at >= datetime('now', '-1 hour')
    `);

    // Get latest member (using last_active_at instead of created_at)
    const latestMember = await client.execute(`
      SELECT user_id 
      FROM forum_user_stats 
      ORDER BY last_active_at DESC 
      LIMIT 1
    `);

    return NextResponse.json({
      totalTopics: topicsCount.rows[0]?.count ?? 0,
      totalPosts: postsCount.rows[0]?.count ?? 0,
      activeUsers: activeUsers.rows[0]?.count ?? 0,
      latestMember: latestMember.rows[0]?.user_id ?? 'No members yet'
    });

  } catch (error) {
    console.error('Detailed error in forum stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch forum stats', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}