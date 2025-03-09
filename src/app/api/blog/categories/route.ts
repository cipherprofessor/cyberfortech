// src/app/api/blog/categories/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { BlogCategory } from '@/types/blog';
import { nanoid, validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * GET handler for fetching all blog categories
 */
export async function GET(request: Request) {
  try {
    const { isAuthorized } = await validateUserAccess(request);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await client.execute({
      sql: `
        SELECT 
          id, 
          name, 
          slug, 
          description,
          parent_id,
          display_order
        FROM blog_categories
        WHERE is_deleted = FALSE
        ORDER BY display_order ASC, name ASC
      `,args: []
    });

    const categories: BlogCategory[] = result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      description: row.description ? String(row.description) : undefined,
      parentId: row.parent_id ? String(row.parent_id) : undefined,
      displayOrder: Number(row.display_order) || 0
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

/**
 * POST handler for creating a new category
 */
export async function POST(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN,
      ROLES.SUPERADMIN
    ]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, parentId, displayOrder = 0 } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await client.execute({
      sql: 'SELECT id FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
      args: [slug]
    });

    if (existingCategory.rows.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    // Create unique ID for the category
    const id = nanoid();

    // Insert new category
    await client.execute({
      sql: `
        INSERT INTO blog_categories (
          id,
          name,
          slug,
          description,
          parent_id,
          display_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        id,
        name,
        slug,
        description || null,
        parentId || null,
        displayOrder
      ]
    });

    return NextResponse.json({
      id,
      name,
      slug,
      description,
      parentId,
      displayOrder
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}