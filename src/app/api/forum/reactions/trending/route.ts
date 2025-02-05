// src/app/api/forum/reactions/trending/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';


const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day';

    const timeRange = {
      hour: "datetime('now', '-1 hour')",
      day: "datetime('now', '-24 hours')",
      week: "datetime('now', '-7 days')"
    }[period];

    const result = await client.execute({
      sql: `
        WITH ReactionStats AS (
          SELECT 
            p.id as post_id,
            t.title as post_title,
            u.name as author_name,
            r.reaction_type,
            COUNT(*) as reaction_count,
            MAX(r.created_at) as latest_reaction,
            COUNT(*) * 1.0 / (
              (CAST(strftime('%s', 'now') as INTEGER) - 
               CAST(strftime('%s', MIN(r.created_at)) as INTEGER)) / 3600.0
            ) as trending_score
          FROM forum_post_reactions r
          JOIN forum_posts p ON r.post_id = p.id
          JOIN forum_topics t ON p.topic_id = t.id
          JOIN users u ON p.author_id = u.id
          WHERE r.created_at >= ${timeRange}
          GROUP BY p.id, r.reaction_type
        )
        SELECT 
          post_id,
          post_title,
          author_name,
          reaction_type,
          reaction_count,
          trending_score,
          latest_reaction as timestamp
        FROM ReactionStats
        ORDER BY trending_score DESC
        LIMIT 10
      `,
      args: []
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching trending reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending reactions' },
      { status: 500 }
    );
  }
}