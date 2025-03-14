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
 * Create a URL-friendly slug from text
 */
function createSlug(text: string): string {
  return slugify(text, {
    lower: true,    // Convert to lowercase
    strict: true,   // Remove special chars
    trim: true      // Trim leading/trailing spaces
  });
}


// src/services/blog-service.ts
import { Row, type Transaction } from '@libsql/client';

import { BlogAuthor, BlogPaginationResponse } from '@/types/blog';



/**
 * Generate a unique slug for a blog post
 */
export async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const result = await client.execute({
      sql: 'SELECT id FROM blog_posts WHERE slug = ? AND is_deleted = FALSE LIMIT 1',
      args: [slug]
    });

    if (result.rows.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}



/**
 * Create a new blog post
 */
export async function createPost(postData: {
  title: string;
  content: string;
  excerpt?: string | null;
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featuredImage?: string | null;
  categories?: BlogCategory[];
  tags?: BlogTag[];
  authorId: string;
}): Promise<{ id: string; slug: string } | null> {
  let transaction: Transaction | undefined;

  try {
    const {
      title,
      content,
      excerpt,
      status = 'draft',
      isFeatured = false,
      metaTitle,
      metaDescription,
      featuredImage,
      categories = [],
      tags = [],
      authorId
    } = postData;

    const id = nanoid();
    // Ensure title is a string before slugifying
    const baseSlug = slugify(String(title), { lower: true, strict: true });
    const slug = await generateUniqueSlug(baseSlug);

    // Begin transaction
    transaction = await client.transaction();

    try {
      // Insert blog post
      await transaction.execute({
        sql: `
          INSERT INTO blog_posts (
            id, 
            title, 
            slug, 
            content, 
            excerpt, 
            featured_image,
            author_id,
            status, 
            is_featured, 
            meta_title,
            meta_description,
            published_at,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [
          id,
          title,
          slug,
          content,
          excerpt || null,
          featuredImage || null,
          authorId,
          status,
          isFeatured ? 1 : 0,
          metaTitle || null,
          metaDescription || null,
          status === 'published' ? new Date().toISOString() : null
        ]
      });

      // Handle categories
      if (categories.length > 0) {
        for (const category of categories) {
          await transaction.execute({
            sql: 'INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
            args: [id, category.id]
          });
        }
      }

      // Handle tags
      if (tags.length > 0) {
        for (const tag of tags) {
          // Make sure we have a valid string for tag name
          const tagName = String(tag.name || '').trim();
          if (!tagName) continue;
          
          const tagSlug = slugify(tagName, { lower: true, strict: true });
          const tagId = nanoid();

          // Insert or get existing tag
          const tagResult = await transaction.execute({
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
          await transaction.execute({
            sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
            args: [id, tagResult.rows[0]?.id || tagId]
          });
        }
      }

      // Commit transaction
      await transaction.commit();

      return { id, slug };
    } catch (error) {
      // Rollback transaction if error occurs
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
}

/**
 * Get a blog post by slug
 */
// src/services/blog-service.ts - Updated getPostBySlug function
// export async function getPostBySlug(slug: string, incrementViewCount = true): Promise<BlogPost | null> {
//   try {
//     // Fetch post with related data
//     const result = await client.execute({
//       sql: `
//         SELECT 
//           b.id,
//           b.title,
//           b.slug,
//           b.content,
//           b.excerpt,
//           b.featured_image,
//           b.meta_title,
//           b.meta_description,
//           b.author_id,
//           b.status,
//           b.view_count,
//           b.is_featured,
//           b.published_at,
//           b.created_at,
//           b.updated_at,
//           u.first_name,
//           u.last_name,
//           u.full_name,
//           u.avatar_url,
//           u.role,
//           GROUP_CONCAT(DISTINCT bc.id || '::' || bc.name || '::' || bc.slug) as categories,
//           GROUP_CONCAT(DISTINCT bt.id || '::' || bt.name || '::' || bt.slug) as tags
//         FROM blog_posts b
//         LEFT JOIN users u ON b.author_id = u.id
//         LEFT JOIN blog_post_categories bpc ON b.id = bpc.post_id
//         LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
//         LEFT JOIN blog_post_tags bpt ON b.id = bpt.post_id
//         LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
//         WHERE b.slug = ? AND b.is_deleted = FALSE
//         GROUP BY b.id
//       `,
//       args: [slug]
//     });

//     if (!result.rows.length) {
//       return null;
//     }

//     const row = result.rows[0];

//     // Increment view count if requested
//     if (incrementViewCount) {
//       await client.execute({
//         sql: `
//           UPDATE blog_posts 
//           SET view_count = view_count + 1 
//           WHERE id = ?
//         `,
//         args: [row.id]
//       });
//     }

//     // Process categories
//     const categoryList: BlogCategory[] = row.categories
//       ? String(row.categories).split(',').map((cat: string) => {
//           const [id, name, slug] = cat.split('::');
//           return { id, name, slug, displayOrder: 0 };
//         })
//       : [];

//     // Process tags
//     const tagList: BlogTag[] = row.tags
//       ? String(row.tags).split(',').map((tag: string) => {
//           const [id, name, slug] = tag.split('::');
//           return { id, name, slug };
//         })
//       : [];

//     // Create author object
//     const author: Author = {
//       id: String(row.author_id),
//       firstName: String(row.first_name || ''),
//       lastName: String(row.last_name || ''),
//       fullName: String(row.full_name || ''),
//       avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
//       role: String(row.role || 'author')
//     };

//     // Return formatted blog post with all fields
//     return {
//       id: String(row.id),
//       title: String(row.title),
//       slug: String(row.slug),
//       content: String(row.content),
//       excerpt: row.excerpt ? String(row.excerpt) : undefined,
//       featuredImage: row.featured_image ? String(row.featured_image) : undefined,
//       authorId: String(row.author_id),
//       status: String(row.status) as 'draft' | 'published' | 'archived',
//       viewCount: Number(row.view_count) + (incrementViewCount ? 1 : 0), // Add 1 if we're incrementing
//       isFeatured: Boolean(row.is_featured),
//       metaTitle: row.meta_title ? String(row.meta_title) : undefined,
//       metaDescription: row.meta_description ? String(row.meta_description) : undefined,
//       publishedAt: row.published_at ? new Date(String(row.published_at)) : undefined,
//       createdAt: new Date(String(row.created_at)),
//       updatedAt: new Date(String(row.updated_at)),
//       categories: categoryList,
//       tags: tagList,
//       author
//     };
//   } catch (error) {
//     console.error('Error fetching blog post:', error);
//     return null;
//   }
// }

/**
 * Get blog posts with pagination and filtering
 */
export async function getPosts(options: {
  page: number;
  limit: number;
  category?: string | null;
  tag?: string | null;
  search?: string | null;
  status?: string | null;
}): Promise<BlogPaginationResponse | null> {
  try {
    const { page, limit, category, tag, search, status = 'published' } = options;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE b.is_deleted = FALSE';
    const params: any[] = [];
    
    if (category) {
      whereClause += ` AND EXISTS (
        SELECT 1 
        FROM blog_post_categories bpc 
        JOIN blog_categories bc ON bpc.category_id = bc.id 
        WHERE bpc.post_id = b.id AND bc.slug = ?
      )`;
      params.push(category);
    }
    
    if (tag) {
      whereClause += ` AND EXISTS (
        SELECT 1 
        FROM blog_post_tags bpt 
        JOIN blog_tags bt ON bpt.tag_id = bt.id 
        WHERE bpt.post_id = b.id AND bt.slug = ?
      )`;
      params.push(tag);
    }
    
    if (search) {
      whereClause += ' AND (b.title LIKE ? OR b.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    whereClause += ' AND b.status = ?';
    params.push(status);

    // Count total matching posts
    const countResult = await client.execute({
      sql: `SELECT COUNT(*) as total FROM blog_posts b ${whereClause}`,
      args: params
    });
    
    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    // Fetch posts with pagination
    const postsResult = await client.execute({
      sql: `
        SELECT 
          b.id,
          b.title,
          b.slug,
          b.content,
          b.excerpt,
          b.featured_image,
          b.author_id,
          b.status,
          b.view_count,
          b.is_featured,
          b.meta_title,
          b.meta_description,
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
        ${whereClause}
        GROUP BY b.id
        ORDER BY 
          CASE WHEN b.is_featured = 1 THEN 0 ELSE 1 END,
          b.published_at DESC NULLS LAST, 
          b.created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [...params, limit, offset]
    });

    // Transform database results to BlogPost objects
    const posts = postsResult.rows.map((row: Row): BlogPost => {
      // Process categories
      const categoryList: BlogCategory[] = row.categories
        ? String(row.categories).split(',').map((cat: string) => {
            const [id, name, slug] = cat.split('::');
            return { id, name, slug, displayOrder: 0 };
          })
        : [];

      // Process tags
      const tagList: BlogTag[] = row.tags
        ? String(row.tags).split(',').map((tag: string) => {
            const [id, name, slug] = tag.split('::');
            return { id, name, slug };
          })
        : [];

      // Create author object
      const author: BlogAuthor = {
        id: String(row.author_id),
        firstName: String(row.first_name || ''),
        lastName: String(row.last_name || ''),
        fullName: String(row.full_name || ''),
        avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
        role: String(row.role || 'author')
      };

      // Return formatted blog post
      return {
        id: String(row.id),
        title: String(row.title),
        slug: String(row.slug),
        content: String(row.content),
        excerpt: row.excerpt ? String(row.excerpt) : undefined,
        featuredImage: row.featured_image ? String(row.featured_image) : undefined,
        authorId: String(row.author_id),
        status: String(row.status) as 'draft' | 'published' | 'archived',
        viewCount: Number(row.view_count),
        isFeatured: Boolean(row.is_featured),
        metaTitle: row.meta_title ? String(row.meta_title) : undefined,
        metaDescription: row.meta_description ? String(row.meta_description) : undefined,
        publishedAt: row.published_at ? new Date(String(row.published_at)) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
        categories: categoryList,
        tags: tagList,
        author
      };
    });

    // Return response with posts and pagination info
    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null;
  }
}

/**
 * Create or update user in the database
 */
export async function ensureUserExists(userData: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl?: string;
  role: string;
}): Promise<boolean> {
  try {
    const { id, email, firstName, lastName, fullName, imageUrl, role } = userData;
    
    // Check if user exists
    const userExists = await client.execute({
      sql: 'SELECT id FROM users WHERE id = ?',
      args: [id]
    });

    if (!userExists.rows.length) {
      // Insert new user
      await client.execute({
        sql: `
          INSERT INTO users (
            id,
            email,
            first_name,
            last_name,
            full_name,
            avatar_url,
            role,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [
          id,
          email,
          firstName,
          lastName,
          fullName,
          imageUrl || null,
          role
        ]
      });
    } else {
      // Update existing user
      await client.execute({
        sql: `
          UPDATE users 
          SET 
            email = ?,
            first_name = ?,
            last_name = ?,
            full_name = ?,
            avatar_url = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [
          email,
          firstName,
          lastName,
          fullName,
          imageUrl || null,
          id
        ]
      });
    }

    return true;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
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
  let transaction: Transaction | undefined;
  
  try {
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
    
    // Generate new slug if title changed
    const newSlug = title ? await generateUniqueSlug(slugify(title, { lower: true, strict: true })) : currentSlug;
    
    // Start transaction
    transaction = await client.transaction();

    try {
      // Update post
      const updateFields: string[] = [];
      const updateParams: (string | number | null)[] = [];
      
      if (title !== undefined) {
        updateFields.push('title = ?');
        updateParams.push(title);
      }
      
      updateFields.push('slug = ?');
      updateParams.push(newSlug);
      
      if (content !== undefined) {
        updateFields.push('content = ?');
        updateParams.push(content);
      }
      
      updateFields.push('excerpt = ?');
      updateParams.push(excerpt || null);
      
      if (status !== undefined) {
        updateFields.push('status = ?');
        updateParams.push(status);
        
        if (status === 'published') {
          updateFields.push('published_at = CASE WHEN published_at IS NULL THEN CURRENT_TIMESTAMP ELSE published_at END');
        }
      }
      
      if (isFeatured !== undefined) {
        updateFields.push('is_featured = ?');
        updateParams.push(isFeatured ? 1 : 0);
      }
      
      updateFields.push('meta_title = ?');
      updateParams.push(metaTitle || null);
      
      updateFields.push('meta_description = ?');
      updateParams.push(metaDescription || null);
      
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      
      const sql = `
        UPDATE blog_posts
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      
      await transaction.execute({
        sql,
        args: [...updateParams, postId]
      });

      // Update categories if provided
      if (categories.length > 0) {
        await transaction.execute({
          sql: 'DELETE FROM blog_post_categories WHERE post_id = ?',
          args: [postId]
        });

        for (const categoryId of categories) {
          await transaction.execute({
            sql: 'INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
            args: [postId, categoryId]
          });
        }
      }

      // Update tags if provided
      if (tags.length > 0) {
        await transaction.execute({
          sql: 'DELETE FROM blog_post_tags WHERE post_id = ?',
          args: [postId]
        });

        for (const tagName of tags) {
          const tagSlug = slugify(tagName, { lower: true, strict: true });
          const tagId = nanoid();
          
          // Insert or update tag
          const tagResult = await transaction.execute({
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
          await transaction.execute({
            sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
            args: [postId, tagResult.rows[0].id]
          });
        }
      }

      await transaction.commit();
      return newSlug;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

/**
 * Delete a blog post (soft delete)
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