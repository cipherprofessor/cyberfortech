// src/app/api/blog/categories/stats/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * GET handler for fetching category statistics (post counts per category)
 */
export async function GET(request: Request) {
  try {
    const { isAuthorized, error } = await validateUserAccess(request, [
      ROLES.ADMIN,
      ROLES.SUPERADMIN,
      ROLES.INSTRUCTOR
    ]);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    // Query to count posts per category
    const result = await client.execute({
      sql: `
        SELECT 
          bc.id AS category_id,
          COUNT(DISTINCT bpc.post_id) AS post_count
        FROM 
          blog_categories bc
        LEFT JOIN 
          blog_post_categories bpc ON bc.id = bpc.category_id
        LEFT JOIN 
          blog_posts bp ON bpc.post_id = bp.id AND bp.is_deleted = FALSE
        WHERE 
          bc.is_deleted = FALSE
        GROUP BY 
          bc.id
      `,
      args: []
    });

    // Convert to object with category_id as key and post_count as value
    const postCounts: Record<string, number> = {};
    
    for (const row of result.rows) {
      postCounts[String(row.category_id)] = Number(row.post_count);
    }

    return NextResponse.json(postCounts);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category statistics' },
      { status: 500 }
    );
  }
}