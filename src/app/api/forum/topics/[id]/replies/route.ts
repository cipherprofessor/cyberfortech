// src/app/api/forum/topics/[topicId]/replies/route.ts
import { createClient, type ResultSet } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface ReplyBody {
  content: string;
  parentId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { topicId } = params;
    const body = await request.json() as ReplyBody;
    const { content, parentId } = body;

    // Validate content
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if topic exists
    const topicExists = await client.execute({
      sql: 'SELECT id FROM forum_topics WHERE id = ? AND is_deleted = FALSE',
      args: [topicId]
    });

    if (!topicExists.rows.length) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Check parent reply if provided
    let parentExists: ResultSet | undefined;
    let parentDepth = 0;
    
    if (parentId) {
      parentExists = await client.execute({
        sql: 'SELECT id, depth FROM forum_posts WHERE id = ? AND is_deleted = FALSE',
        args: [parentId]
      });

      if (!parentExists.rows.length) {
        return NextResponse.json(
          { error: 'Parent reply not found' },
          { status: 404 }
        );
      }

      // Check max depth
      parentDepth = Number(parentExists.rows[0].depth || 0);
      if (parentDepth >= 3) {
        return NextResponse.json(
          { error: 'Maximum reply depth reached' },
          { status: 400 }
        );
      }
    }

    const replyId = nanoid();

    // Start transaction
    const transaction = await client.transaction();

    try {
      // Insert reply
      await transaction.execute({
        sql: `
          INSERT INTO forum_posts (
            id,
            topic_id,
            parent_id,
            author_id,
            content,
            depth,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        args: [
          replyId,
          topicId,
          parentId || null,
          user.id,
          content,
          parentDepth + 1
        ]
      });

      // Update topic's reply count and last activity
      await transaction.execute({
        sql: `
          UPDATE forum_topics
          SET 
            reply_count = reply_count + 1,
            last_post_id = ?,
            last_post_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [replyId, topicId]
      });

      // Update user's post count
      await transaction.execute({
        sql: `
          UPDATE forum_user_stats
          SET 
            total_posts = total_posts + 1,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `,
        args: [user.id]
      });

      // Commit transaction
      await transaction.commit();

      // Return the created reply
      const reply = {
        id: replyId,
        topicId,
        parentId: parentId || null,
        authorId: user.id,
        content,
        depth: parentDepth + 1,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json(reply);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const { topicId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const parentId = searchParams.get('parentId');
    
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.topic_id = ? AND p.is_deleted = FALSE';
    const queryParams: any[] = [topicId];

    if (parentId) {
      whereClause += ' AND p.parent_id = ?';
      queryParams.push(parentId);
    }

    // Get total count
    const countResult = await client.execute({
      sql: `
        SELECT COUNT(*) as total 
        FROM forum_posts p 
        ${whereClause}
      `,
      args: queryParams
    });

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    // Get replies with author info
    const result = await client.execute({
      sql: `
        SELECT 
          p.*,
          u.first_name,
          u.last_name,
          u.full_name,
          u.avatar_url,
          us.total_posts as author_post_count,
          us.reputation_points as author_reputation
        FROM forum_posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN forum_user_stats us ON p.author_id = us.user_id
        ${whereClause}
        ORDER BY 
          CASE 
            WHEN p.parent_id IS NULL THEN p.created_at
            ELSE (
              SELECT created_at 
              FROM forum_posts 
              WHERE id = p.parent_id
            )
          END ASC,
          p.created_at ASC
        LIMIT ? OFFSET ?
      `,
      args: [...queryParams, limit, offset]
    });

    const replies = result.rows.map(row => ({
      id: row.id,
      topicId: row.topic_id,
      parentId: row.parent_id,
      content: row.content,
      depth: Number(row.depth),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: row.author_id,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        postCount: Number(row.author_post_count),
        reputation: Number(row.author_reputation)
      }
    }));

    return NextResponse.json({
      replies,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}