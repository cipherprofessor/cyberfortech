// src/app/api/forum/categories/[id]/stats/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// src/app/api/forum/categories/[id]/stats/route.ts
// src/app/api/forum/categories/[id]/stats/route.ts
interface Params {
    params: {
      id: string;
    };
  }
  
  export async function GET(request: Request, { params }: Params) {
    const id = Number(params?.id);
  
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
  
    try {
      const statsResult = await client.execute({
        sql: `
          WITH TopicStats AS (
            SELECT 
              COUNT(DISTINCT t.id) as total_topics,
              COUNT(DISTINCT CASE 
                WHEN t.created_at >= datetime('now', '-24 hours') 
                THEN t.id 
              END) as topics_today,
              COUNT(DISTINCT t.author_id) as unique_authors
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
          SELECT 
            COALESCE(ts.total_topics, 0) as total_topics,
            COALESCE(ts.topics_today, 0) as topics_today,
            COALESCE(ts.unique_authors, 0) as unique_authors,
            COALESCE(ps.total_posts, 0) as total_posts,
            COALESCE(ps.active_posters, 0) as active_posters
          FROM TopicStats ts
          CROSS JOIN PostStats ps
        `,
        args: [id, id]
      });
  
      return NextResponse.json(statsResult.rows[0]);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch category stats' },
        { status: 500 }
      );
    }
  }