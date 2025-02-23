// src/app/api/blog/route.ts
import { createClient, Row, type Transaction } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import slugify from 'slugify';
import { Author, BlogCategory, BlogPaginationResponse, BlogPost, BlogTag } from '@/types/blog';


interface BlogPostRow {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featured_image: string | null;
    author_id: string;
    status: string;
    view_count: number;
    is_featured: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
    categories: string | null;
    tags: string | null;
  }
  

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function generateUniqueSlug(baseSlug: string): Promise<string> {
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

// src/app/api/blog/route.ts
export async function POST(request: Request) {
  let transaction: Transaction | undefined;

  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.STUDENT, ROLES.INSTRUCTOR]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    // Ensure user exists in database
    const userExists = await client.execute({
      sql: 'SELECT id FROM users WHERE id = ?',
      args: [user.id]
    });

    if (!userExists.rows.length) {
      // Insert user with data from our clerk utility
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
          user.id,
          user.email,
          user.firstName,
          user.lastName,
          user.fullName,
          user.imageUrl,
          user.role
        ]
      });
    } else {
      // Update existing user data
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
          user.email,
          user.firstName,
          user.lastName,
          user.fullName,
          user.imageUrl,
          user.id
        ]
      });
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      status = 'draft',
      isFeatured = false,
      metaTitle,
      metaDescription,
      categories = [],
      tags = []
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const id = nanoid();
    const baseSlug = slugify(title, { lower: true, strict: true });
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
            author_id,
            status, 
            is_featured, 
            meta_title,
            meta_description,
            published_at,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [
          id,
          title,
          slug,
          content,
          excerpt || null,
          user.id,
          status,
          isFeatured ? 1 : 0,
          metaTitle || null,
          metaDescription || null,
          status === 'published' ? new Date().toISOString() : null
        ]
      });

      // Handle categories
      if (categories.length > 0) {
        for (const categoryId of categories) {
          await transaction.execute({
            sql: 'INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
            args: [id, categoryId]
          });
        }
      }

      // Handle tags
      if (tags.length > 0) {
        for (const tagName of tags) {
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
            args: [id, tagResult.rows[0].id]
          });
        }
      }

      // Commit transaction
      await transaction.commit();

      return NextResponse.json({ id, slug });

    } catch (error) {
      // Rollback transaction if error occurs
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }

  } catch (error) {
    console.error('Error creating blog post:', error);

    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'A blog post with this title already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function GET(
    request: Request
  ): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const category = searchParams.get('category');
      const tag = searchParams.get('tag');
      const search = searchParams.get('search');
      const status = searchParams.get('status');
      
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
  
      if (status) {
        whereClause += ' AND b.status = ?';
        params.push(status);
      } else {
        whereClause += ' AND b.status = ?';
        params.push('published');
      }
  
      const countResult = await client.execute({
        sql: `SELECT COUNT(*) as total FROM blog_posts b ${whereClause}`,
        args: params
      });
      
      const total = Number(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);
  
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
        const author: Author = {
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
  
      return NextResponse.json({
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        }
      });
  
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }
  }