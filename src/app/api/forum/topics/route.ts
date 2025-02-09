import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

function sanitizeText(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
}

function getFullNameFromUser(user: any): string {
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  
  if (firstName) {
    return firstName;
  }
  
  if (user.username) {
    return user.username;
  }
  
  if (user.emailAddresses && user.emailAddresses.length > 0) {
    return user.emailAddresses[0].emailAddress;
  }
  
  return '';
}

function getPrimaryEmail(user: any): string {
  if (!user?.emailAddresses || user.emailAddresses.length === 0) {
    return '';
  }
  
  const primaryEmail = user.emailAddresses.find((email: any) => 
    email.id === user.primaryEmailAddressId
  );
  return primaryEmail?.emailAddress ?? user.emailAddresses[0].emailAddress ?? '';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId');
    const offset = (page - 1) * limit;

    // Base conditions for the WHERE clause
    let whereConditions = ['t.is_deleted = FALSE'];
    let whereArgs: any[] = [];

    // Add category filter if provided
    if (categoryId) {
      whereConditions.push('t.category_id = ?');
      whereArgs.push(categoryId);
    }

    // Build the WHERE clause
    const whereClause = whereConditions.join(' AND ');

    // Get total count first
    const countResult = await client.execute({
      sql: `
        SELECT COUNT(*) as total 
        FROM forum_topics t
        WHERE ${whereClause}
      `,
      args: whereArgs
    });

    // Then get the topics with all author details
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
          t.author_name,
          t.author_email,
          t.author_image,
          t.category_id,
          c.name as category_name,
          sc.id as subcategory_id,
          sc.name as subcategory_name,
          (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id AND is_deleted = FALSE) as reply_count
        FROM forum_topics t
        LEFT JOIN forum_categories c ON t.category_id = c.id
        LEFT JOIN forum_subcategories sc ON t.subcategory_id = sc.id
        WHERE ${whereClause}
        ORDER BY t.is_pinned DESC, t.created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [...whereArgs, limit, offset]
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

export async function POST(req: NextRequest) {
  const tx = await client.transaction();

  try {
    // Check authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    // Get user details
    const authorName = getFullNameFromUser(user);
    const authorEmail = getPrimaryEmail(user);
    const authorImage = user.imageUrl ?? '';

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

    // Sanitize input
    const sanitizedTitle = sanitizeText(title);
    const sanitizedContent = sanitizeText(content);

    // Verify category exists
    const categoryExists = await tx.execute({
      sql: 'SELECT id FROM forum_categories WHERE id = ? AND is_deleted = FALSE',
      args: [categoryId]
    });

    if (!categoryExists.rows.length) {
      throw new Error('Invalid category');
    }

    // Verify subcategory if provided
    if (subcategoryId) {
      const subcategoryExists = await tx.execute({
        sql: 'SELECT id FROM forum_subcategories WHERE id = ? AND category_id = ? AND is_deleted = FALSE',
        args: [subcategoryId, categoryId]
      });

      if (!subcategoryExists.rows.length) {
        throw new Error('Invalid subcategory');
      }
    }

    // Generate topic ID
    const topicId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Create the topic with author details
    await tx.execute({
      sql: `
        INSERT INTO forum_topics (
          id,
          category_id,
          subcategory_id,
          author_id,
          author_name,
          author_email,
          author_image,
          title,
          content,
          views,
          is_pinned,
          is_locked,
          is_deleted,
          created_at,
          updated_at,
          last_post_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, FALSE, FALSE, FALSE, ?, ?, ?)
      `,
      args: [
        topicId,
        categoryId,
        subcategoryId || null,
        authorId,
        authorName,
        authorEmail,
        authorImage,
        sanitizedTitle,
        sanitizedContent,
        now,
        now,
        now
      ]
    });

    // Update or create user stats
    await tx.execute({
      sql: `
        INSERT INTO forum_user_stats (
          user_id,
          total_topics,
          total_posts,
          total_reactions_received,
          total_solutions_provided,
          reputation_points,
          activity_streak,
          last_active_at,
          created_at,
          updated_at
        ) VALUES (?, 1, 0, 0, 0, 0, 0, ?, ?, ?)
        ON CONFLICT (user_id) DO UPDATE SET
          total_topics = total_topics + 1,
          last_active_at = ?,
          updated_at = ?
      `,
      args: [authorId, now, now, now, now, now]
    });

    // Commit transaction
    await tx.commit();

    // Fetch the complete topic data
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
    // Rollback transaction on error
    await tx.rollback();
    
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
      sql: 'SELECT author_id FROM forum_topics WHERE id = ? AND is_deleted = FALSE',
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

    // Get current timestamp
    const now = new Date().toISOString();

    // Soft delete the topic
    await client.execute({
      sql: `
        UPDATE forum_topics 
        SET 
          is_deleted = TRUE,
          deleted_at = ?,
          updated_at = ?
        WHERE id = ?
      `,
      args: [now, now, topicId]
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