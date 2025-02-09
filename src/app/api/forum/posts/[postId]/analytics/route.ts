// src/app/api/forum/posts/[postId]/analytics/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    // Get time format based on period
    const timeFormat = {
      hourly: '%Y-%m-%d %H:00',
      daily: '%Y-%m-%d',
      weekly: '%Y-%W'
    }[period] || '%Y-%m-%d';

    // Get interval based on period
    const interval = {
      hourly: '-24 hours',
      daily: '-30 days',
      weekly: '-12 weeks'
    }[period] || '-30 days';

    // Get time series data
    const timeseriesResult = await client.execute({
      sql: `
        WITH RECURSIVE time_series AS (
          SELECT datetime('now', ?) as time
          UNION ALL
          SELECT datetime(time, '-1 ${period}')
          FROM time_series
          WHERE time > datetime('now', ?)
        ),
        reaction_counts AS (
          SELECT 
            strftime(?, created_at) as period,
            reaction_type,
            COUNT(*) as count
          FROM forum_post_reactions
          WHERE post_id = ?
            AND created_at >= datetime('now', ?)
          GROUP BY period, reaction_type
        )
        SELECT 
          ts.time as timestamp,
          COALESCE(SUM(CASE WHEN rc.reaction_type = 'like' THEN rc.count END), 0) as like,
          COALESCE(SUM(CASE WHEN rc.reaction_type = 'heart' THEN rc.count END), 0) as heart,
          COALESCE(SUM(CASE WHEN rc.reaction_type = 'insightful' THEN rc.count END), 0) as insightful,
          COALESCE(SUM(CASE WHEN rc.reaction_type = 'funny' THEN rc.count END), 0) as funny
        FROM time_series ts
        LEFT JOIN reaction_counts rc ON ts.time = rc.period
        GROUP BY ts.time
        ORDER BY ts.time
      `,
      args: [interval, interval, timeFormat, params.postId, interval]
    });

    // Get totals
    const totalsResult = await client.execute({
      sql: `
        SELECT 
          reaction_type,
          COUNT(*) as count
        FROM forum_post_reactions
        WHERE post_id = ?
        GROUP BY reaction_type
      `,
      args: [params.postId]
    });

    // Transform totals into an object
    const totals = totalsResult.rows.reduce((acc: any, row: any) => {
      acc[row.reaction_type] = row.count;
      return acc;
    }, {
      like: 0,
      heart: 0,
      insightful: 0,
      funny: 0
    });

    return NextResponse.json({
      timeData: timeseriesResult.rows,
      totals
    });

  } catch (error) {
    console.error('Error fetching reaction analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Add trend calculation endpoint
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate trending score (based on time decay)
    await client.execute({
      sql: `
        INSERT INTO forum_reaction_analytics (
          post_id,
          reaction_type,
          reaction_count,
          trending_score,
          time_period,
          timestamp
        )
        SELECT 
          post_id,
          reaction_type,
          COUNT(*) as reaction_count,
          COUNT(*) / ((strftime('%s', 'now') - strftime('%s', MIN(created_at))) / 3600.0) as trending_score,
          'hourly',
          datetime('now')
        FROM forum_post_reactions
        WHERE post_id = ?
          AND created_at >= datetime('now', '-1 hour')
        GROUP BY post_id, reaction_type
      `,
      args: [params.postId]
    });

    return NextResponse.json({ message: 'Analytics updated' });

  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    );
  }
}