// src/app/api/forum/topics/[topicId]/replies/route.ts
import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface ReplyTreeNode {
  id: number;
  content: string;
  authorId: string;
  parentId: number | null;
  children: ReplyTreeNode[];
}

function buildReplyTree(replies: any[]): ReplyTreeNode[] {
  const replyMap = new Map();
  const rootReplies: ReplyTreeNode[] = [];

  // First pass: Create map of all replies
  replies.forEach(reply => {
    replyMap.set(reply.id, { ...reply, children: [] });
  });

  // Second pass: Build tree structure
  replies.forEach(reply => {
    const replyNode = replyMap.get(reply.id);
    if (reply.parent_id && replyMap.has(reply.parent_id)) {
      const parent = replyMap.get(reply.parent_id);
      parent.children.push(replyNode);
    } else {
      rootReplies.push(replyNode);
    }
  });

  return rootReplies;
}

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const result = await client.execute({
      sql: `
        WITH RECURSIVE reply_tree AS (
          -- Base case: Get root level replies
          SELECT 
            p.*,
            0 as depth,
            json_array() as path
          FROM forum_posts p
          WHERE p.topic_id = ? 
            AND p.parent_id IS NULL
            AND p.is_deleted = FALSE

          UNION ALL

          -- Recursive case: Get replies to replies
          SELECT 
            p.*,
            rt.depth + 1,
            json_array(rt.path, p.id)
          FROM forum_posts p
          JOIN reply_tree rt ON p.parent_id = rt.id
          WHERE p.is_deleted = FALSE
        )
        SELECT 
          rt.*,
          u.name as author_name,
          u.avatar_url as author_avatar,
          u.role as author_role,
          (SELECT COUNT(*) FROM forum_post_likes WHERE post_id = rt.id) as likes_count
        FROM reply_tree rt
        LEFT JOIN users u ON rt.author_id = u.id
        ORDER BY path, created_at
      `,
      args: [params.topicId]
    });

    const replyTree = buildReplyTree(result.rows);

    return NextResponse.json(replyTree);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, parentId } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if parent reply exists if parentId is provided
    let parentExists = null;
    if (parentId) {
      parentExists = await client.execute({
        sql: 'SELECT id, depth FROM forum_posts WHERE id = ?',
        args: [parentId]
      });

      if (!parentExists.rows.length) {
        return NextResponse.json(
          { error: 'Parent reply not found' },
          { status: 404 }
        );
      }

      // Check max depth
      if (parentExists.rows[0] && Number(parentExists.rows[0].depth) >= 3) {
        return NextResponse.json(
          { error: 'Maximum reply depth reached' },
          { status: 400 }
        );
      }
    }

    // Create the reply
    const result = await client.execute({
      sql: `
        INSERT INTO forum_posts (
          topic_id,
          author_id,
          content,
          parent_id,
          depth,
          created_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        params.topicId,
        userId,
        content,
        parentId || null,
        parentId && parentExists && parentExists.rows[0] ? Number(parentExists.rows[0].depth) + 1 : 0
      ]
    });

    // Get the created reply with author info
    const reply = await client.execute({
      sql: `
        SELECT 
          p.*,
          u.name as author_name,
          u.avatar_url as author_avatar
        FROM forum_posts p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.id = ?
      `,
      args: [result.lastInsertRowid!]
    });

    return NextResponse.json(reply.rows[0]);
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}