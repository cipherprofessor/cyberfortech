// src/app/api/blog/tags/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import slugify from 'slugify';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          t.id,
          t.name,
          t.slug,
          (
            SELECT COUNT(DISTINCT bpt.post_id)
            FROM blog_post_tags bpt
            JOIN blog_posts bp ON bpt.post_id = bp.id
            WHERE bpt.tag_id = t.id
            AND bp.status = 'published'
            AND (bp.is_deleted IS NULL OR bp.is_deleted = FALSE)
          ) as post_count
        FROM blog_tags t
        WHERE (t.is_deleted IS NULL OR t.is_deleted = FALSE)
        ORDER BY t.name ASC
      `,
      args: []
    });

    const tags = result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      postCount: Number(row.post_count || 0)
    }));

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN, ROLES.SUPERADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { name, slug: customSlug } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const slug = customSlug || slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingTag = await client.execute({
      sql: `
        SELECT id 
        FROM blog_tags 
        WHERE slug = ? 
        AND (is_deleted IS NULL OR is_deleted = FALSE)
      `,
      args: [slug]
    });

    if (existingTag.rows.length > 0) {
      return NextResponse.json(
        { error: 'Tag with this slug already exists' },
        { status: 409 }
      );
    }

    const id = nanoid();

    // Create tag
    await client.execute({
      sql: `
        INSERT INTO blog_tags (
          id,
          name,
          slug,
          created_at,
          is_deleted
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, FALSE)
      `,
      args: [id, name, slug]
    });

    return NextResponse.json({
      id,
      name,
      slug,
      postCount: 0
    });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}