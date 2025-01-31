// src/app/api/forum/categories/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;

    const result = await client.execute({
      sql: `INSERT INTO forum_categories (name, description, icon) VALUES (?, ?, ?)`,
      args: [name, description, icon]
    });

    // Convert BigInt to number for JSON serialization
    const categoryId = Number(result.lastInsertRowid);

    // Fetch the created category to ensure we have the correct data
    const { rows: [category] } = await client.execute({
      sql: `SELECT * FROM forum_categories WHERE id = ?`,
      args: [categoryId]
    });

    return NextResponse.json({
      id: categoryId,
      name,
      description,
      icon,
      created_at: category.created_at,
      updated_at: category.updated_at
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// GET categories
export async function GET() {
    try {
      const { rows: categories } = await client.execute(`
        WITH CategoryStats AS (
          SELECT 
            c.id as category_id,
            COUNT(DISTINCT CASE WHEN t.is_deleted = FALSE THEN t.id END) as total_topics,
            COUNT(DISTINCT p.id) as total_posts
          FROM forum_categories c
          LEFT JOIN forum_topics t ON c.id = t.category_id
          LEFT JOIN forum_posts p ON t.id = p.topic_id
          WHERE c.is_deleted = FALSE
          GROUP BY c.id
        )
        SELECT 
          c.id,
          c.name,
          c.description,
          c.icon,
          c.created_at,
          c.updated_at,
          COALESCE(cs.total_topics, 0) as totalTopics,
          COALESCE(cs.total_posts, 0) as totalPosts,
          COALESCE(json_group_array(
            CASE 
              WHEN s.id IS NOT NULL 
              THEN json_object(
                'id', s.id,
                'name', s.name
              )
              ELSE NULL 
            END
          ), '[]') as subCategories
        FROM forum_categories c
        LEFT JOIN CategoryStats cs ON c.id = cs.category_id
        LEFT JOIN forum_subcategories s ON c.id = s.category_id AND s.is_deleted = FALSE
        WHERE c.is_deleted = FALSE
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `);
  
      // Process the categories
      const processedCategories = categories.map(category => {
        let subCategories = [];
        try {
          const parsedSubs = category.subCategories ? JSON.parse(category.subCategories.toString()) : [];
          subCategories = parsedSubs
            .filter(Boolean)
            .map((sub: any) => ({
              id: Number(sub.id),
              name: String(sub.name)
            }));
        } catch (error) {
          console.error('Error parsing subcategories:', error);
        }
  
        return {
          id: Number(category.id),
          name: String(category.name),
          description: String(category.description || ''),
          icon: category.icon ? String(category.icon) : undefined,
          totalTopics: Number(category.totalTopics || 0),
          totalPosts: Number(category.totalPosts || 0),
          created_at: category.created_at,
          updated_at: category.updated_at,
          subCategories
        };
      });
  
      return NextResponse.json(processedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' }, 
        { status: 500 }
      );
    }
  }

// DELETE category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await client.execute({
      sql: `UPDATE forum_categories 
            SET is_deleted = TRUE, 
                deleted_at = CURRENT_TIMESTAMP 
            WHERE id = ?`,
      args: [id]
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}