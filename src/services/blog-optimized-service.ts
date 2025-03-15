import { createClient } from '@libsql/client';
import {
  BlogAuthor,
  BlogCategory,
  BlogTag,
  BlogPost
} from '@/types/blog';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * Get a post by slug with author, categories, and tags in a single optimized query
 */
export async function getOptimizedPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // First, get the post with its author
    const postResult = await client.execute({
      sql: `
        SELECT 
          p.id as post_id, 
          p.title as post_title, 
          p.slug as post_slug, 
          p.content as post_content, 
          p.excerpt as post_excerpt, 
          p.featured_image as post_featured_image,
          p.author_id as post_author_id, 
          p.status as post_status, 
          p.view_count as post_view_count, 
          p.like_count as post_like_count,
          p.is_featured as post_is_featured,
          p.meta_title as post_meta_title,
          p.meta_description as post_meta_description,
          p.published_at as post_published_at, 
          p.created_at as post_created_at, 
          p.updated_at as post_updated_at,
          u.id as author_id, 
          u.first_name as author_first_name,
          u.last_name as author_last_name,
          u.full_name as author_full_name,
          u.avatar_url as author_avatar_url,
          u.role as author_role
        FROM blog_posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.slug = ? AND p.is_deleted = FALSE
      `,
      args: [slug]
    });

    if (postResult.rows.length === 0) {
      return null;
    }

    const postData = postResult.rows[0];

    // Get categories and tags in parallel
    const [categoriesResult, tagsResult] = await Promise.all([
      // Get categories
      client.execute({
        sql: `
          SELECT c.id, c.name, c.slug, c.description, c.display_order, c.parent_id, c.image_url
          FROM blog_categories c
          JOIN blog_post_categories pc ON c.id = pc.category_id
          WHERE pc.post_id = ? AND c.is_deleted = FALSE
        `,
        args: [postData.post_id]
      }),
      
      // Get tags
      client.execute({
        sql: `
          SELECT t.id, t.name, t.slug
          FROM blog_tags t
          JOIN blog_post_tags pt ON t.id = pt.tag_id
          WHERE pt.post_id = ? AND t.is_deleted = 0
        `,
        args: [postData.post_id]
      })
    ]);

    // Format the data
    const author: BlogAuthor = {
      id: postData.author_id as string,
      firstName: postData.author_first_name as string || '',
      lastName: postData.author_last_name as string || '',
      fullName: postData.author_full_name as string || '',
      avatarUrl: postData.author_avatar_url as string || undefined,
      role: postData.author_role as string || ''
    };

    const categories: BlogCategory[] = categoriesResult.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      description: row.description as string || undefined,
      displayOrder: Number(row.display_order || 0),
      parentId: row.parent_id as string || undefined,
      imageUrl: row.image_url as string || undefined
    }));

    const tags: BlogTag[] = tagsResult.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string
    }));

    // Increment view count in the background
    client.execute({
      sql: 'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?',
      args: [postData.post_id]
    }).catch(error => {
      console.error('Error incrementing view count:', error);
    });

    // Create the complete blog post object
    const post: BlogPost = {
      id: postData.post_id as string,
      title: postData.post_title as string,
      slug: postData.post_slug as string,
      content: postData.post_content as string,
      excerpt: postData.post_excerpt as string || undefined,
      featuredImage: postData.post_featured_image as string || undefined,
      authorId: postData.post_author_id as string,
      status: (postData.post_status as string || 'draft') as 'draft' | 'published' | 'archived',
      viewCount: Number(postData.post_view_count || 0),
      likeCount: Number(postData.post_like_count || 0),
      isFeatured: Boolean(postData.post_is_featured),
      metaTitle: postData.post_meta_title as string || undefined,
      metaDescription: postData.post_meta_description as string || undefined,
      publishedAt: postData.post_published_at ? new Date(postData.post_published_at as string) : undefined,
      createdAt: new Date(postData.post_created_at as string),
      updatedAt: new Date(postData.post_updated_at as string),
      categories,
      tags,
      author
    };

    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Get trending posts with optimized query
 */
export async function getOptimizedTrendingPosts(limit = 5, excludeId?: string): Promise<BlogPost[]> {
  try {
    const query = `
      SELECT 
        p.id as post_id, 
        p.title as post_title, 
        p.slug as post_slug, 
        p.excerpt as post_excerpt,
        p.content as post_content,
        p.featured_image as post_featured_image, 
        p.view_count as post_view_count,
        p.status as post_status,
        p.is_featured as post_is_featured,
        p.published_at as post_published_at, 
        p.created_at as post_created_at,
        p.updated_at as post_updated_at,
        p.author_id as post_author_id,
        u.id as author_id, 
        u.full_name as author_full_name, 
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        u.avatar_url as author_avatar_url,
        u.role as author_role
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published' AND p.is_deleted = FALSE
      ${excludeId ? 'AND p.id != ?' : ''}
      ORDER BY p.view_count DESC, p.published_at DESC
      LIMIT ?
    `;

    const args = excludeId ? [excludeId, limit] : [limit];
    const result = await client.execute({ sql: query, args });

    return result.rows.map(row => ({
      id: row.post_id as string,
      title: row.post_title as string,
      slug: row.post_slug as string,
      content: row.post_content as string,
      excerpt: row.post_excerpt as string || undefined,
      featuredImage: row.post_featured_image as string || undefined,
      viewCount: Number(row.post_view_count || 0),
      likeCount: Number(row.post_like_count || 0),
      status: (row.post_status as string || 'published') as 'draft' | 'published' | 'archived',
      isFeatured: Boolean(row.post_is_featured),
      authorId: row.post_author_id as string,
      publishedAt: row.post_published_at ? new Date(row.post_published_at as string) : undefined,
      createdAt: new Date(row.post_created_at as string),
      updatedAt: new Date(row.post_updated_at as string),
      author: {
        id: row.author_id as string,
        firstName: row.author_first_name as string || '',
        lastName: row.author_last_name as string || '',
        fullName: row.author_full_name as string || '',
        avatarUrl: row.author_avatar_url as string || undefined,
        role: row.author_role as string || ''
      },
      categories: [],
      tags: []
    }));
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
}

/**
 * Get author's other posts with optimized query
 */
export async function getOptimizedAuthorPosts(authorId: string, limit = 3, excludeId?: string): Promise<BlogPost[]> {
  try {
    const query = `
      SELECT 
        p.id as post_id, 
        p.title as post_title, 
        p.slug as post_slug, 
        p.excerpt as post_excerpt,
        p.content as post_content,
        p.featured_image as post_featured_image,
        p.status as post_status,
        p.is_featured as post_is_featured,
        p.published_at as post_published_at, 
        p.created_at as post_created_at, 
        p.updated_at as post_updated_at,
        p.view_count as post_view_count,
        p.author_id as post_author_id,
        u.id as author_id,
        u.full_name as author_full_name,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        u.avatar_url as author_avatar_url,
        u.role as author_role
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ? 
        AND p.status = 'published' 
        AND p.is_deleted = FALSE
        ${excludeId ? 'AND p.id != ?' : ''}
      ORDER BY p.published_at DESC, p.created_at DESC
      LIMIT ?
    `;

    const args = excludeId ? [authorId, excludeId, limit] : [authorId, limit];
    const result = await client.execute({ sql: query, args });

    return result.rows.map(row => ({
      id: row.post_id as string,
      title: row.post_title as string,
      slug: row.post_slug as string,
      content: row.post_content as string,
      excerpt: row.post_excerpt as string || undefined,
      featuredImage: row.post_featured_image as string || undefined,
      publishedAt: row.post_published_at ? new Date(row.post_published_at as string) : undefined,
      createdAt: new Date(row.post_created_at as string),
      updatedAt: new Date(row.post_updated_at as string),
      viewCount: Number(row.post_view_count || 0),
      likeCount: Number(row.post_like_count || 0),
      isFeatured: Boolean(row.post_is_featured),
      status: (row.post_status as string || 'published') as 'draft' | 'published' | 'archived',
      authorId: row.post_author_id as string,
      author: {
        id: row.author_id as string,
        firstName: row.author_first_name as string || '',
        lastName: row.author_last_name as string || '',
        fullName: row.author_full_name as string || '',
        avatarUrl: row.author_avatar_url as string || undefined,
        role: row.author_role as string || ''
      },
      categories: [],
      tags: []
    }));
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return [];
  }
}

/**
 * Get combined post interactions (likes, bookmarks) in a single query
 */
export async function getPostInteractions(postId: string, userId?: string) {
  try {
    if (!userId) {
      const likeCount = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
        args: [postId]
      });
      
      return {
        likeCount: Number(likeCount.rows[0].count),
        isLiked: false,
        isBookmarked: false
      };
    }
    
    const [likeCount, userInteraction] = await Promise.all([
      // Get like count
      client.execute({
        sql: 'SELECT COUNT(*) as count FROM blog_post_likes WHERE post_id = ?',
        args: [postId]
      }),
      
      // Get user interaction
      client.execute({
        sql: `
          SELECT 
            (SELECT COUNT(*) FROM blog_post_likes WHERE post_id = ? AND user_id = ?) as is_liked,
            (SELECT COUNT(*) FROM blog_post_bookmarks WHERE post_id = ? AND user_id = ?) as is_bookmarked
        `,
        args: [postId, userId, postId, userId]
      })
    ]);

    return {
      likeCount: Number(likeCount.rows[0].count),
      isLiked: Boolean(Number(userInteraction.rows[0].is_liked)),
      isBookmarked: Boolean(Number(userInteraction.rows[0].is_bookmarked))
    };
  } catch (error) {
    console.error('Error getting post interactions:', error);
    return {
      likeCount: 0,
      isLiked: false,
      isBookmarked: false
    };
  }
}


// This could run as a cron job or maintenance task
export async function validateLikeCounts() {
  try {
    const posts = await client.execute({
      sql: 'SELECT id, like_count FROM blog_posts WHERE is_deleted = FALSE', args: []
    });

    for (const post of posts.rows) {
      const likesResult = await client.execute({
        sql: 'SELECT COUNT(*) as actual_count FROM blog_post_likes WHERE post_id = ?',
        args: [post.id]
      });
      
      const actualCount = Number(likesResult.rows[0].actual_count);
      
      if (Number(post.like_count) !== actualCount) {
        console.log(`Fixing like count for post ${post.id}: ${post.like_count} → ${actualCount}`);
        await client.execute({
          sql: 'UPDATE blog_posts SET like_count = ? WHERE id = ?',
          args: [actualCount, post.id]
        });
      }
    }
    
    console.log('Like count validation completed');
  } catch (error) {
    console.error('Error validating like counts:', error);
  }
}