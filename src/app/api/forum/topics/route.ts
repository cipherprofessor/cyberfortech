// src/app/api/forum/topics/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

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