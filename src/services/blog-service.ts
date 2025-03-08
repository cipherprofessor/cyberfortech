// src/services/blog-service.ts
import { createClient } from '@libsql/client';
import { BlogPost, BlogCategory, BlogTag } from '@/types/blog';
import slugify from 'slugify';
import { nanoid } from '@/lib/clerk'; // Assuming this is your nanoid implementation

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * Get a blog post by slug
 */
export async function getPostBySlug(slug: string, incrementViewCount = true): Promise<BlogPost | null> {
  try {
    // Fetch post with related data
    const result = await client.execute({
      sql: `
        SELECT 
          b.id,
          b.title,
          b.slug,
          b.content,
          b.excerpt,
          b.featured_image,
          b.meta_title,
          b.meta_description,
          b.author_id,
          b.status,
          b.view_count,
          b.is_featured,
          b.published_at,
          b.created_at,
          b.updated_at,
          u.first_name,
          u.last_name,
          u.full_name,
          u.avatar_url,
          u.role,
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
      return null;
    }

    const row = result.rows[0];

    // Increment view count if requested
    if (incrementViewCount) {
      await client.execute({
        sql: `
          UPDATE blog_posts 
          SET view_count = view_count + 1 
          WHERE id = ?
        `,
        args: [row.id]
      });
    }

    // Transform database row to BlogPost object
    return {
      id: String(row.id),
      title: String(row.title),
      slug: String(row.slug),
      content: String(row.content),
      excerpt: row.excerpt ? String(row.excerpt) : undefined,
      featuredImage: row.featured_image ? String(row.featured_image) : undefined,
      authorId: String(row.author_id),
      status: String(row.status) as 'draft' | 'published' | 'archived',
      viewCount: Number(row.view_count || 0) + (incrementViewCount ? 1 : 0), // Add 1 if we're incrementing
      isFeatured: Boolean(row.is_featured),
      metaTitle: row.meta_title ? String(row.meta_title) : undefined,
      metaDescription: row.meta_description ? String(row.meta_description) : undefined,
      publishedAt: row.published_at ? new Date(String(row.published_at)) : undefined,
      createdAt: new Date(String(row.created_at)),
      updatedAt: new Date(String(row.updated_at)),
      categories: row.categories 
        ? String(row.categories).split(',').map(cat => {
            const [id, name, slug] = cat.split('::');
            return { id, name, slug, displayOrder: 0 };
          })
        : [],
      tags: row.tags
        ? String(row.tags).split(',').map(tag => {
            const [id, name, slug] = tag.split('::');
            return { id, name, slug };
          })
        : [],
      author: {
        id: String(row.author_id),
        firstName: String(row.first_name || ''),
        lastName: String(row.last_name || ''),
        fullName: String(row.full_name || ''),
        avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
        role: String(row.role || 'author')
      }
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Check if user has permission to edit/delete a post
 */
export async function checkPostPermission(postId: string, userId: string, userRole: string): Promise<boolean> {
  try {
    const result = await client.execute({
      sql: 'SELECT author_id FROM blog_posts WHERE id = ? AND is_deleted = FALSE',
      args: [postId]
    });

    if (!result.rows.length) {
      return false;
    }

    const isAuthor = result.rows[0].author_id === userId;
    const isAdmin = ['admin', 'superadmin'].includes(userRole.toLowerCase());

    return isAuthor || isAdmin;
  } catch (error) {
    console.error('Error checking post permission:', error);
    return false;
  }
}

/**
 * Update a blog post
 */
export async function updatePost(
  postId: string, 
  data: {
    title?: string;
    content?: string;
    excerpt?: string | null;
    status?: 'draft' | 'published' | 'archived';
    isFeatured?: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
    categories?: string[];
    tags?: string[];
  },
  currentSlug: string
): Promise<string | null> {
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
  } = data;
  
  try {
    // Generate new slug if title changed
    const newSlug = title ? createSlug(title) : currentSlug;
    
    // Start transaction
    await client.execute('BEGIN TRANSACTION');

    try {
      // Convert undefined values to null for SQL
      const titleParam = title ?? null;
      const contentParam = content ?? null;
      const excerptParam = excerpt ?? null;
      const statusParam = status ?? null;
      // Convert boolean to number for SQLite
      const isFeaturedParam = isFeatured === undefined ? null : (isFeatured ? 1 : 0);
      const metaTitleParam = metaTitle ?? null;
      const metaDescriptionParam = metaDescription ?? null;

      // Update post
      await client.execute({
        sql: `
          UPDATE blog_posts
          SET
            title = CASE WHEN ? IS NOT NULL THEN ? ELSE title END,
            slug = ?,
            content = CASE WHEN ? IS NOT NULL THEN ? ELSE content END,
            excerpt = ?,
            status = CASE WHEN ? IS NOT NULL THEN ? ELSE status END,
            is_featured = CASE WHEN ? IS NOT NULL THEN ? ELSE is_featured END,
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
          titleParam, titleParam,
          newSlug,
          contentParam, contentParam,
          excerptParam,
          statusParam, statusParam,
          isFeaturedParam, isFeaturedParam,
          metaTitleParam,
          metaDescriptionParam,
          postId
        ]
      });

      // Update categories if provided
      if (categories.length > 0) {
        await client.execute({
          sql: 'DELETE FROM blog_post_categories WHERE post_id = ?',
          args: [postId]
        });

        for (const categoryId of categories) {
          await client.execute({
            sql: 'INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
            args: [postId, categoryId]
          });
        }
      }

      // Update tags if provided
      if (tags.length > 0) {
        await client.execute({
          sql: 'DELETE FROM blog_post_tags WHERE post_id = ?',
          args: [postId]
        });

        for (const tagName of tags) {
          const tagSlug = createSlug(tagName);
          const tagId = nanoid();
          
          // Insert or update tag
          const tagResult = await client.execute({
            sql: `
              INSERT INTO blog_tags (id, name, slug)
              VALUES (?, ?, ?)
              ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name
              RETURNING id
            `,
            args: [tagId, tagName, tagSlug]
          });

          // Link tag to post
          const resolvedTagId = tagResult.rows[0]?.id || tagId;
          await client.execute({
            sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
            args: [postId, resolvedTagId]
          });
        }
      }

      await client.execute('COMMIT');
      return newSlug;
    } catch (error) {
      await client.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

/**
 * Soft delete a blog post
 */
export async function deletePost(postId: string): Promise<boolean> {
  try {
    await client.execute({
      sql: `
        UPDATE blog_posts
        SET is_deleted = TRUE,
            deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [postId]
    });
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

/**
 * Create a URL-friendly slug from text
 */
function createSlug(text: string): string {
  return slugify(text, {
    lower: true,    // Convert to lowercase
    strict: true,   // Remove special chars
    trim: true      // Trim leading/trailing spaces
  });
}