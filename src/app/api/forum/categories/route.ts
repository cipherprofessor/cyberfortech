// src/app/api/forum/categories/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    // Fetch categories with their subcategories
    const categoriesResult = await client.execute(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.icon,
        COUNT(DISTINCT t.id) as total_topics,
        COUNT(DISTINCT p.id) as total_posts
      FROM forum_categories c
      LEFT JOIN forum_topics t ON t.category_id = c.id
      LEFT JOIN forum_posts p ON p.topic_id = t.id
      GROUP BY c.id
    `);

    const categories = await Promise.all(
      categoriesResult.rows.map(async (category: any) => {
        const subcategoriesResult = await client.execute({
          sql: 'SELECT id, name FROM forum_subcategories WHERE category_id = ?',
          args: [category.id],
        });

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          icon: category.icon,
          totalTopics: category.total_topics,
          totalPosts: category.total_posts,
          subCategories: subcategoriesResult.rows.map((sub: any) => ({
            id: sub.id,
            name: sub.name,
          })),
        };
      })
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}