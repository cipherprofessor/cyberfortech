// src/app/api/forum/posts/[postId]/reactions/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { pusherServer } from '@/lib/pusher';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { reactionType } = await request.json();
    const trendingData = await client.execute({
        sql: `
          WITH ReactionStats AS (
            SELECT 
              COUNT(*) as reaction_count,
              COUNT(*) * 1.0 / (
                (CAST(strftime('%s', 'now') as INTEGER) - 
                 CAST(strftime('%s', MIN(created_at)) as INTEGER)) / 3600.0
              ) as trending_score
            FROM forum_post_reactions
            WHERE post_id = ? AND created_at >= datetime('now', '-1 hour')
          )
          SELECT 
            p.id as post_id,
            t.title as post_title,
            u.name as author_name,
            ? as reaction_type,
            rs.reaction_count,
            rs.trending_score,
            datetime('now') as timestamp
          FROM forum_posts p
          JOIN forum_topics t ON p.topic_id = t.id
          JOIN users u ON p.author_id = u.id
          CROSS JOIN ReactionStats rs
          WHERE p.id = ?
        `,
        args: [params.postId, reactionType, params.postId]
      });
  
      if (trendingData.rows.length > 0) {
        await pusherServer.trigger('forum-reactions', 'new-reaction', trendingData.rows[0]);
      }
  
      return NextResponse.json(trendingData.rows);
    } catch (error) {
    console.error('Error handling reaction:', error);
    return NextResponse.json(
      { error: 'Failed to process reaction' },
      { status: 500 }
    );
  }
}