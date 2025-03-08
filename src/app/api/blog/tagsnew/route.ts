// src/app/api/blog/tags/route.ts

import { BlogTag } from '@/types/blog';
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';


const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          id, 
          name, 
          slug
        FROM blog_tags
        WHERE id IN (
          -- Only get tags that are used in published posts
          SELECT DISTINCT tag_id 
          FROM blog_post_tags bpt
          JOIN blog_posts bp ON bp.id = bpt.post_id
          WHERE bp.status = 'published' AND bp.is_deleted = FALSE
        )
        ORDER BY name ASC
      `, args: []
    });

    const tags: BlogTag[] = result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug)
    }));

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog tags' },
      { status: 500 }
    );
  }
}