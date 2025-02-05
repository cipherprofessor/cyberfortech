// src/app/api/forum/categories/[id]/subcategories/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// src/app/api/forum/categories/[id]/subcategories/route.ts
// src/app/api/forum/categories/[id]/subcategories/route.ts
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
    const subcategoriesResult = await client.execute({
      sql: `
        SELECT 
          s.id,
          s.name,
          s.created_at,
          (
            SELECT COUNT(*)
            FROM forum_topics t
            WHERE t.subcategory_id = s.id
            AND t.is_deleted = FALSE
          ) as topic_count,
          (
            SELECT COUNT(*)
            FROM forum_posts p
            JOIN forum_topics t ON p.topic_id = t.id
            WHERE t.subcategory_id = s.id
            AND t.is_deleted = FALSE
          ) as post_count
        FROM forum_subcategories s
        WHERE s.category_id = ? AND s.is_deleted = FALSE
        ORDER BY s.created_at DESC
      `,
      args: [id]
    });

    return NextResponse.json(subcategoriesResult.rows);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}