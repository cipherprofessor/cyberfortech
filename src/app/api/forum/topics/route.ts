// const debug = (...args: any[]) => {
//     console.log('[Topics API]', ...args);
//   };

import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { title, content, categoryId, subcategoryId, authorId } = body;

    // Validate required fields
    if (!title?.trim() || !content?.trim() || !categoryId || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that authorId matches authenticated user
    if (authorId !== userId) {
      return NextResponse.json(
        { error: 'Invalid author ID' },
        { status: 403 }
      );
    }

    // Verify category exists
    const categoryExists = await client.execute({
      sql: 'SELECT id FROM forum_categories WHERE id = ? AND is_deleted = FALSE',
      args: [categoryId]
    });

    if (!categoryExists.rows.length) {
      throw new Error('Invalid category');
    }

    // Verify subcategory if provided
    if (subcategoryId) {
      const subcategoryExists = await client.execute({
        sql: 'SELECT id FROM forum_subcategories WHERE id = ? AND category_id = ? AND is_deleted = FALSE',
        args: [subcategoryId, categoryId]
      });

      if (!subcategoryExists.rows.length) {
        throw new Error('Invalid subcategory');
      }
    }

    // Create the topic
    const insertResult = await client.execute({
      sql: `
        INSERT INTO forum_topics (
          category_id,
          subcategory_id,
          author_id,
          title,
          content,
          views,
          is_pinned,
          is_locked,
          is_deleted,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [categoryId, subcategoryId || null, authorId, title, content]
    });

    const topicId = Number(insertResult.lastInsertRowid);
    if (!topicId) {
      throw new Error('Failed to create topic');
    }

    // Update user stats
    await client.execute({
      sql: `
        INSERT INTO forum_user_stats (
          user_id,
          topics_count,
          posts_count,
          last_active_at
        ) VALUES (?, 1, 0, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) DO UPDATE SET
          topics_count = topics_count + 1,
          last_active_at = CURRENT_TIMESTAMP
      `,
      args: [authorId]
    });

    // Get complete topic data
    const topicResult = await client.execute({
      sql: `
        SELECT 
          t.*,
          c.name as category_name,
          sc.name as subcategory_name
        FROM forum_topics t
        LEFT JOIN forum_categories c ON t.category_id = c.id
        LEFT JOIN forum_subcategories sc ON t.subcategory_id = sc.id
        WHERE t.id = ?
      `,
      args: [topicId]
    });

    return NextResponse.json({
      message: 'Topic created successfully',
      topic: topicResult.rows[0]
    });

  } catch (error) {
    console.error('Error creating topic:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create topic';
    const statusCode = 
      errorMessage === 'Invalid category' || errorMessage === 'Invalid subcategory' 
        ? 400 
        : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}


// src/app/api/forum/topics/route.ts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get total count first
    const countResult = await client.execute(`
      SELECT COUNT(*) as total 
      FROM forum_topics 
      WHERE is_deleted = FALSE
    `);

    // Then get the topics
    const topics = await client.execute({
      sql: `
        SELECT 
          t.id,
          t.title,
          t.content,
          t.views,
          t.is_pinned,
          t.is_locked,
          t.created_at,
          t.updated_at,
          t.author_id,
          t.category_id,
          c.name as category_name,
          sc.id as subcategory_id,
          sc.name as subcategory_name,
          (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id) as reply_count
        FROM forum_topics t
        LEFT JOIN forum_categories c ON t.category_id = c.id
        LEFT JOIN forum_subcategories sc ON t.subcategory_id = sc.id
        WHERE t.is_deleted = FALSE
        ORDER BY t.is_pinned DESC, t.created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [limit, offset]
    });

    return NextResponse.json({
      topics: topics.rows,
      pagination: {
        total: Number(countResult.rows[0].total),
        page,
        limit,
        pages: Math.ceil(Number(countResult.rows[0].total) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
  
  // Add DELETE handler for topic deletion
  // In your topics route.ts file

export async function DELETE(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('id');

    if (!topicId) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    // First get the topic details
    const topicResult = await client.execute({
      sql: 'SELECT author_id FROM forum_topics WHERE id = ?',
      args: [topicId]
    });

    if (!topicResult.rows.length) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const topic = topicResult.rows[0];

    // Get user role from Clerk metadata
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const isAdmin = user.publicMetadata?.role === 'admin' || 
                   user.publicMetadata?.role === 'superadmin';

    // Check if user is either admin or the topic author
    if (!isAdmin && topic.author_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this topic' },
        { status: 403 }
      );
    }

    // Soft delete the topic
    await client.execute({
      sql: `
        UPDATE forum_topics 
        SET is_deleted = TRUE, 
            deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      args: [topicId]
    });

    return NextResponse.json({ 
      message: 'Topic deleted successfully',
      topicId: topicId
    });

  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}

  