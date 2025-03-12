// src/app/api/blog/categories/[slug]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import slugify from 'slugify';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN, ROLES.SUPERADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { slug } = params;
    const body = await request.json();
    const {
      name,
      description,
      parentId,
      displayOrder
    } = body;

    // Check if category exists
    const existingCategory = await client.execute({
      sql: 'SELECT id FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
      args: [slug]
    });

    if (!existingCategory.rows.length) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate new slug if name is changed
    const newSlug = name ? slugify(name, { lower: true, strict: true }) : slug;

    // Update category
    await client.execute({
      sql: `
        UPDATE blog_categories
        SET 
          name = COALESCE(?, name),
          slug = ?,
          description = COALESCE(?, description),
          parent_id = COALESCE(?, parent_id),
          display_order = COALESCE(?, display_order),
          updated_at = CURRENT_TIMESTAMP
        WHERE slug = ? AND is_deleted = FALSE
      `,
      args: [
        name || null,
        newSlug,
        description !== undefined ? description : null,
        parentId !== undefined ? parentId : null,
        displayOrder !== undefined ? displayOrder : null,
        slug
      ]
    });

    return NextResponse.json({ slug: newSlug });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN, ROLES.SUPERADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { slug } = params;

    // Check if category has posts
    const postsCount = await client.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM blog_post_categories bpc
        JOIN blog_categories bc ON bpc.category_id = bc.id
        WHERE bc.slug = ? AND bc.is_deleted = FALSE
      `,
      args: [slug]
    });

    if (Number(postsCount.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    // Get the category ID for reference
    const categoryResult = await client.execute({
      sql: 'SELECT id FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
      args: [slug]
    });
    
    if (!categoryResult.rows.length) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const categoryId = categoryResult.rows[0].id;

    // Hard delete the category (completely remove from database)
    await client.execute({
      sql: 'DELETE FROM blog_categories WHERE id = ?',
      args: [categoryId]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}