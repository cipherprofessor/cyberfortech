import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const result = await client.execute({
      sql: `
        WITH RECURSIVE comment_tree AS (
          -- Base case: top-level comments
          SELECT 
            c.*,
            u.full_name as user_full_name,
            u.avatar_url as user_avatar_url,
            0 as level
          FROM blog_comments c
          JOIN users u ON c.user_id = u.id
          WHERE c.post_id = ?
            AND c.parent_id IS NULL
            AND (c.is_deleted IS NULL OR c.is_deleted = FALSE)
            AND c.is_approved = TRUE

          UNION ALL

          -- Recursive case: replies
          SELECT 
            c.*,
            u.full_name as user_full_name,
            u.avatar_url as user_avatar_url,
            ct.level + 1
          FROM blog_comments c
          JOIN users u ON c.user_id = u.id
          JOIN comment_tree ct ON c.parent_id = ct.id
          WHERE (c.is_deleted IS NULL OR c.is_deleted = FALSE)
            AND c.is_approved = TRUE
        )
        SELECT * FROM comment_tree
        ORDER BY created_at DESC, level ASC
      `,
      args: [postId]
    });

    const comments = result.rows.map(row => ({
      id: String(row.id),
      postId: String(row.post_id),
      userId: String(row.user_id),
      content: String(row.content),
      parentId: row.parent_id ? String(row.parent_id) : undefined,
      isApproved: Boolean(row.is_approved),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      isDeleted: Boolean(row.is_deleted),
      deletedAt: row.deleted_at ? String(row.deleted_at) : undefined,
      user: {
        id: String(row.user_id),
        fullName: String(row.user_full_name),
        avatarUrl: row.user_avatar_url ? String(row.user_avatar_url) : undefined
      }
    }));

    // Organize comments into a tree structure
    const commentTree = comments.reduce((acc: any, comment) => {
      if (!comment.parentId) {
        if (!acc[comment.id]) {
          acc[comment.id] = { ...comment, replies: [] };
        } else {
          acc[comment.id] = { ...comment, replies: acc[comment.id].replies };
        }
      } else {
        if (!acc[comment.parentId]) {
          acc[comment.parentId] = { replies: [comment] };
        } else {
          acc[comment.parentId].replies.push(comment);
        }
      }
      return acc;
    }, {});

    return NextResponse.json(Object.values(commentTree));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { postId, content, parentId } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    const id = nanoid();
    const isApproved = true; // You can modify this based on your moderation needs

    await client.execute({
      sql: `
        INSERT INTO blog_comments (
          id,
          post_id,
          user_id,
          content,
          parent_id,
          is_approved,
          created_at,
          updated_at,
          is_deleted
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
      `,
      args: [id, postId, user.id, content, parentId || null, isApproved]
    });

    const comment = {
      id,
      postId,
      userId: user.id,
      content,
      parentId,
      isApproved,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      user: {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.imageUrl
      }
    };

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns the comment or has admin rights
    const comment = await client.execute({
      sql: 'SELECT user_id FROM blog_comments WHERE id = ?',
      args: [commentId]
    });

    if (comment.rows.length === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const isOwner = comment.rows[0].user_id === user.id;
    const isAdmin = [ROLES.ADMIN, ROLES.SUPERADMIN].includes(user.role as 'admin' | 'superadmin');

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await client.execute({
      sql: `
        UPDATE blog_comments 
        SET is_deleted = TRUE, 
            deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      args: [commentId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}