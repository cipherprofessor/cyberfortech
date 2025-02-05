import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface Params {
  params: {
    id: string;
  };
}

// src/app/api/forum/categories/[id]/stats/route.ts
// src/app/api/forum/categories/[id]/stats/route.ts
export async function GET(
    request: Request,
    context: { params: { id: string } }
  ) {
    try {
      const params = await context.params;
      const categoryId = params.id;
  
      const statsResult = await client.execute({
        sql: `
          WITH TopicStats AS (
            SELECT 
              COUNT(DISTINCT t.id) as total_topics,
              COUNT(DISTINCT CASE 
                WHEN t.created_at >= datetime('now', '-24 hours') 
                THEN t.id 
              END) as topics_today
            FROM forum_topics t
            WHERE t.category_id = ? AND t.is_deleted = FALSE
          ),
          PostStats AS (
            SELECT 
              COUNT(DISTINCT p.id) as total_posts,
              COUNT(DISTINCT p.author_id) as active_posters
            FROM forum_posts p
            JOIN forum_topics t ON p.topic_id = t.id
            WHERE t.category_id = ? AND t.is_deleted = FALSE
            AND p.created_at >= datetime('now', '-24 hours')
          )
          SELECT * FROM TopicStats, PostStats
        `,
        args: [categoryId, categoryId]
      });
  
      return NextResponse.json(statsResult.rows[0]);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
  }