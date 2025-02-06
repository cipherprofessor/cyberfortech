// src/app/api/forum/categories/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET handler
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
        c.color,
        c.display_order,
        c.is_active,
        c.created_at,
        c.updated_at,
        COALESCE(cs.total_topics, 0) as total_topics,
        COALESCE(cs.total_posts, 0) as total_posts,
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
      ORDER BY c.display_order ASC, c.created_at DESC
    `);

    // Process the categories
    const processedCategories = categories.map(category => {
      let subCategories = [];
      try {
        const parsedSubs = category.subCategories ? JSON.parse(category.subCategories.toString()) : [];
        subCategories = parsedSubs
          .filter(Boolean)
          .map((sub: any) => ({
            id: String(sub.id),
            name: String(sub.name)
          }));
      } catch (error) {
        console.error('Error parsing subcategories:', error);
      }

      return {
        id: String(category.id),
        name: String(category.name),
        description: String(category.description || ''),
        icon: category.icon ? String(category.icon) : undefined,
        color: category.color ? String(category.color) : undefined,
        display_order: Number(category.display_order || 0),
        is_active: Boolean(category.is_active),
        total_topics: Number(category.total_topics || 0),
        total_posts: Number(category.total_posts || 0),
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

// POST handler
export async function POST(request: Request) {
  const tx = await client.transaction();
  
  try {
    const body = await request.json();
    const {
      name,
      description,
      icon,
      color,
      display_order,
      is_active
    } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID(); // Generate unique ID
    const now = new Date().toISOString();

    // Insert category
    await tx.execute({
      sql: `
        INSERT INTO forum_categories (
          id, name, description, icon, color,
          display_order, is_active, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        name.trim(),
        description?.trim() || null,
        icon?.trim() || null,
        color?.trim() || null,
        display_order || 0,
        is_active === undefined ? true : is_active,
        now,
        now
      ]
    });

    // Initialize category stats
    await tx.execute({
      sql: `
        INSERT INTO forum_category_stats (
          category_id, total_topics, total_posts,
          last_post_at, updated_at
        )
        VALUES (?, 0, 0, ?, ?)
      `,
      args: [id, now, now]
    });

    // Commit transaction
    await tx.commit();

    // Fetch the created category with stats
    const { rows: [category] } = await client.execute({
      sql: `
        SELECT 
          c.*,
          s.total_topics,
          s.total_posts,
          s.last_post_at
        FROM forum_categories c
        LEFT JOIN forum_category_stats s ON c.id = s.category_id
        WHERE c.id = ?
      `,
      args: [id]
    });

    return NextResponse.json({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      display_order: Number(category.display_order),
      is_active: Boolean(category.is_active),
      total_topics: Number(category.total_topics),
      total_posts: Number(category.total_posts),
      last_post_at: category.last_post_at,
      created_at: category.created_at,
      updated_at: category.updated_at,
      subCategories: []
    });

  } catch (error: any) {
    // Rollback transaction on error
    await tx.rollback();
    
    console.error('Error creating category:', error);
    
    const errorMessage = error.message?.includes('UNIQUE constraint failed')
      ? 'A category with this name already exists'
      : 'Failed to create category';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await client.execute({
      sql: `
        UPDATE forum_categories 
        SET is_deleted = TRUE, 
            deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      args: [id]
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}