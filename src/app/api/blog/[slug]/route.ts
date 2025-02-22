// src/app/api/blog/[slug]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import slugify from 'slugify';
import { ROLES } from '@/constants/auth';
import { isAdmin } from '@/utils/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(
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
    
    const { slug } = await params;

    // Increment view count
    await client.execute({
      sql: `
        UPDATE blog_posts 
        SET view_count = view_count + 1 
        WHERE slug = ? AND is_deleted = FALSE
      `,
      args: [slug]
    });

    // Fetch post with related data
    const result = await client.execute({
      sql: `
        SELECT 
          b.*,
          u.first_name,
          u.last_name,
          u.full_name,
          u.avatar_url,
          GROUP_CONCAT(DISTINCT bc.id || '::' || bc.name || '::' || bc.slug) as categories,
          GROUP_CONCAT(DISTINCT bt.id || '::' || bt.name || '::' || bt.slug) as tags
        FROM blog_posts b
        LEFT JOIN users u ON b.author_id = u.id
        LEFT JOIN blog_post_categories bpc ON b.id = bpc.post_id
        LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
        LEFT JOIN blog_post_tags bpt ON b.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE b.slug = ? AND b.is_deleted = FALSE
        GROUP BY b.id
      `,
      args: [slug]
    });



   if (!result.rows.length) {
    return NextResponse.json(
      { error: 'Blog post not found' },
      { status: 404 }
    );
  }

  const row = result.rows[0];
  const post = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    featuredImage: row.featured_image,
    status: row.status,
    viewCount: row.view_count,
    isFeatured: Boolean(row.is_featured),
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: {
      id: row.author_id,
      firstName: row.first_name,
      lastName: row.last_name,
      fullName: row.full_name,
      avatarUrl: row.avatar_url
    },
    categories: typeof row.categories === 'string' ? row.categories.split(',').map((cat: string) => {
      const [id, name, slug] = cat.split('::');
      return { id, name, slug };
    }) : [],
    tags: typeof row.tags === 'string' ? row.tags.split(',').map((tag: string) => {
      const [id, name, slug] = tag.split('::');
      return { id, name, slug };
    }) : []
  };

  return NextResponse.json(post);
} catch (error) {
  console.error('Error fetching blog post:', error);
  return NextResponse.json(
    { error: 'Failed to fetch blog post' },
    { status: 500 }
  );
}
}

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
        title,
        content,
        excerpt,
        status,
        isFeatured,
        metaTitle,
        metaDescription,
        categories = [],
        tags = []
      } = body;
  
      // Check if post exists
      const postResult = await client.execute({
        sql: 'SELECT id, author_id FROM blog_posts WHERE slug = ? AND is_deleted = FALSE',
        args: [slug]
      });
  
      if (!postResult.rows.length) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
  
      const post = postResult.rows[0];
      
      // Only allow authors and admins to edit
      if (post.author_id !== user.id && !isAdmin(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
  
      // Start transaction
      await client.execute('BEGIN TRANSACTION');

  try {
    // Update post
    const newSlug = title ? slugify(title, { lower: true, strict: true }) : slug;
    await client.execute({
      sql: `
        UPDATE blog_posts
        SET
          title = COALESCE(?, title),
          slug = ?,
          content = COALESCE(?, content),
          excerpt = ?,
          status = COALESCE(?, status),
          is_featured = COALESCE(?, is_featured),
          meta_title = ?,
          meta_description = ?,
          published_at = CASE
            WHEN status = 'published' AND published_at IS NULL THEN CURRENT_TIMESTAMP
            ELSE published_at
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        title,
        newSlug,
        content,
        excerpt,
        status,
        isFeatured,
        metaTitle,
        metaDescription,
        post.id
      ]
    });

    // Update categories
    if (categories.length > 0) {
      await client.execute({
        sql: 'DELETE FROM blog_post_categories WHERE post_id = ?',
        args: [post.id]
      });

      for (const categoryId of categories) {
        await client.execute({
          sql: 'INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
          args: [post.id, categoryId]
        });
      }
    }

    // Update tags
    if (tags.length > 0) {
      await client.execute({
        sql: 'DELETE FROM blog_post_tags WHERE post_id = ?',
        args: [post.id]
      });

      for (const tagName of tags) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        const tagId = nanoid();
        
        await client.execute({
          sql: `
            INSERT INTO blog_tags (id, name, slug)
            VALUES (?, ?, ?)
            ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name
            RETURNING id
          `,
          args: [tagId, tagName, tagSlug]
        });

        await client.execute({
          sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
          args: [post.id, tagId]
        });
      }
    }

    await client.execute('COMMIT');

    return NextResponse.json({ slug: newSlug });
  } catch (error) {
    await client.execute('ROLLBACK');
    throw error;
  }
} catch (error) {
  console.error('Error updating blog post:', error);
  return NextResponse.json(
    { error: 'Failed to update blog post' },
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
  // Check if post exists and user has permission
  const postResult = await client.execute({
    sql: 'SELECT id, author_id FROM blog_posts WHERE slug = ? AND is_deleted = FALSE',
    args: [slug]
  });

  if (!postResult.rows.length) {
    return NextResponse.json(
      { error: 'Blog post not found' },
      { status: 404 }
    );
  }

  const post = postResult.rows[0];
  if (post.author_id !== user.id && !isAdmin(user.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  // Soft delete the post
  await client.execute({
    sql: `
      UPDATE blog_posts
      SET is_deleted = TRUE,
          deleted_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [post.id]
  });

  return NextResponse.json({ success: true });
} catch (error) {
  console.error('Error deleting blog post:', error);
  return NextResponse.json(
    { error: 'Failed to delete blog post' },
    { status: 500 }
  );
}
}