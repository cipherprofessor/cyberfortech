// src/app/api/forum/categories/[id]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const categoryId = params.id;

    const [categoryResult, latestTopicsResult] = await Promise.all([
      client.execute({
        sql: `
          SELECT 
            c.id,
            c.name,
            c.description,
            c.icon,
            c.created_at,
            c.updated_at,
            COUNT(DISTINCT t.id) as total_topics,
            COUNT(DISTINCT p.id) as total_posts
          FROM forum_categories c
          LEFT JOIN forum_topics t ON c.id = t.category_id AND t.is_deleted = FALSE
          LEFT JOIN forum_posts p ON t.id = p.topic_id
          WHERE c.id = ?
          GROUP BY c.id
        `,
        args: [categoryId]
      }),

      client.execute({
        sql: `
          SELECT 
            t.id,
            t.title,
            t.created_at,
            u.name as author_name,
            (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id) as reply_count
          FROM forum_topics t
          JOIN users u ON t.author_id = u.id
          WHERE t.category_id = ? AND t.is_deleted = FALSE
          ORDER BY t.created_at DESC
          LIMIT 5
        `,
        args: [categoryId]
      })
    ]);

    if (!categoryResult.rows.length) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...categoryResult.rows[0],
      latestTopics: latestTopicsResult.rows
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}