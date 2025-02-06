// src/app/api/forum/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tx = await client.transaction();
  
  try {
    const { id } = params;
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

    // Check if category exists
    const { rows: [existingCategory] } = await client.execute({
      sql: `SELECT id FROM forum_categories WHERE id = ? AND is_deleted = FALSE`,
      args: [id]
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update category
    await tx.execute({
      sql: `
        UPDATE forum_categories 
        SET 
          name = ?,
          description = ?,
          icon = ?,
          color = ?,
          display_order = ?,
          is_active = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        name.trim(),
        description?.trim() || null,
        icon?.trim() || null,
        color?.trim() || null,
        display_order || 0,
        is_active === undefined ? true : is_active,
        id
      ]
    });

    // Commit transaction
    await tx.commit();

    // Fetch updated category with stats
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
      updated_at: category.updated_at
    });

  } catch (error: any) {
    // Rollback transaction on error
    await tx.rollback();
    
    console.error('Error updating category:', error);
    
    const errorMessage = error.message?.includes('UNIQUE constraint failed')
      ? 'A category with this name already exists'
      : 'Failed to update category';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET single category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { rows: [category] } = await client.execute({
      sql: `
        SELECT 
          c.*,
          s.total_topics,
          s.total_posts,
          s.last_post_at,
          COALESCE(json_group_array(
            CASE 
              WHEN sub.id IS NOT NULL 
              THEN json_object(
                'id', sub.id,
                'name', sub.name
              )
              ELSE NULL 
            END
          ), '[]') as subCategories
        FROM forum_categories c
        LEFT JOIN forum_category_stats s ON c.id = s.category_id
        LEFT JOIN forum_subcategories sub ON c.id = sub.category_id AND sub.is_deleted = FALSE
        WHERE c.id = ? AND c.is_deleted = FALSE
        GROUP BY c.id
      `,
      args: [id]
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Process subcategories
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
      subCategories
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}