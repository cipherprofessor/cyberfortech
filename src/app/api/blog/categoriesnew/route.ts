// src/app/api/blog/categories/route.ts

import { BlogCategory } from '@/types/blog';
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
          slug, 
          display_order
        FROM blog_categories
        WHERE is_deleted = FALSE
        ORDER BY display_order ASC, name ASC
      `, args: []
    });

    const categories: BlogCategory[] = result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      displayOrder: Number(row.display_order)
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}