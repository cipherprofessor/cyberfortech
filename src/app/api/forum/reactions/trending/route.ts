// src/app/api/forum/reactions/trending/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

//Sadiya
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// src/app/api/forum/reactions/trending/route.ts
export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || 'day';
  
      const timeRange = {
        hour: "datetime('now', '-1 hour')",
        day: "datetime('now', '-24 hours')",
        week: "datetime('now', '-7 days')"
      }[period] || "datetime('now', '-24 hours')";
  
      const result = await client.execute({
        sql: `
          SELECT 
            p.id as post_id,
            t.title as post_title,
            t.author_id,
            COUNT(*) as reaction_count,
            COUNT(*) * 1.0 / (
              (strftime('%s', 'now') - strftime('%s', MIN(pr.created_at))) / 3600.0
            ) as trending_score
          FROM forum_post_reactions pr
          JOIN forum_posts p ON pr.post_id = p.id
          JOIN forum_topics t ON p.topic_id = t.id
          WHERE pr.created_at >= ?
          GROUP BY p.id
          ORDER BY trending_score DESC
          LIMIT 10
        `,
        args: [timeRange]
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
