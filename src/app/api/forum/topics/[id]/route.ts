//src/app/api/forum/topics/[id]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the topic ID directly from params
    const topicId = params.id;
    console.log("ID from params:", params?.id);
    
    if (!topicId || topicId === 'undefined' || topicId === '[id]') {
      console.error('Invalid topicId:', topicId);
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching topic with ID: ${topicId}`);
    console.log("Full params object:", JSON.stringify(params));
console.log("ID from params:", params?.id);

    // First, get the topic details
    const topicResult = await client.execute({
      sql: `
        SELECT 
          t.*,
          c.name as category_name,
          sc.name as subcategory_name,
          (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id AND is_deleted = FALSE) as reply_count
        FROM forum_topics t
        LEFT JOIN forum_categories c ON t.category_id = c.id
        LEFT JOIN forum_subcategories sc ON t.subcategory_id = sc.id
        WHERE t.id = ? AND t.is_deleted = FALSE
      `,
      args: [topicId]
    });

    if (!topicResult.rows.length) {
      console.log(`Topic not found: ${topicId}`);
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Update view count
    await client.execute({
      sql: `
        UPDATE forum_topics
        SET views = views + 1
        WHERE id = ?
      `,
      args: [topicId]
    });

    // Transform data for client consumption
    const topic = topicResult.rows[0];
    const formattedTopic = {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      category_name: topic.category_name,
      categoryId: topic.category_id,
      authorId: topic.author_id,
      authorName: topic.author_name,
      authorEmail: topic.author_email,
      authorImage: topic.author_image,
      createdAt: topic.created_at,
      updatedAt: topic.updated_at,
      is_pinned: topic.is_pinned,
      is_locked: topic.is_locked,
      replies_count: topic.reply_count,
      views: (typeof topic.views === 'number' ? topic.views : 0) + 1, // Include the incremented view
      subcategory_id: topic.subcategory_id,
      subcategory_name: topic.subcategory_name,
    };

    console.log(`Successfully fetched topic: ${topicId}`);
    return NextResponse.json({ topic: formattedTopic });

  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}