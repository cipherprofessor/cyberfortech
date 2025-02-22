// src/app/api/blog/tags/[slug]/route.ts
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
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await client.execute({
      sql: `
        SELECT id 
        FROM blog_tags 
        WHERE slug = ? 
        AND (is_deleted IS NULL OR is_deleted = FALSE)
      `,
      args: [slug]
    });

    if (!existingTag.rows.length) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    const newSlug = slugify(name, { lower: true, strict: true });

    // Check if new slug already exists (if name was changed)
    if (newSlug !== slug) {
      const slugExists = await client.execute({
        sql: `
          SELECT id 
          FROM blog_tags 
          WHERE slug = ? 
          AND (is_deleted IS NULL OR is_deleted = FALSE)
        `,
        args: [newSlug]
      });

      if (slugExists.rows.length > 0) {
        return NextResponse.json(
          { error: 'Tag with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update tag
    await client.execute({
      sql: `
        UPDATE blog_tags
        SET 
          name = ?,
          slug = ?
        WHERE slug = ?
        AND (is_deleted IS NULL OR is_deleted = FALSE)
      `,
      args: [name, newSlug, slug]
    });

    return NextResponse.json({
      slug: newSlug,
      name
    });

  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
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

    // Check if tag has posts
    const postsCount = await client.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM blog_post_tags bpt
        JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bt.slug = ?
        AND (bt.is_deleted IS NULL OR bt.is_deleted = FALSE)
      `,
      args: [slug]
    });

    if (Number(postsCount.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag with existing posts' },
        { status: 400 }
      );
    }

    // Delete tag (soft delete if column exists)
    await client.execute({
      sql: `
        UPDATE blog_tags
        SET 
          is_deleted = TRUE,
          deleted_at = CURRENT_TIMESTAMP
        WHERE slug = ?
        AND (is_deleted IS NULL OR is_deleted = FALSE)
      `,
      args: [slug]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}