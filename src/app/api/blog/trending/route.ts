import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const excludeId = searchParams.get('exclude') || '';
    
    // Fetch trending posts based on view count
    const result = await client.execute({
      sql: `
        SELECT 
          bp.id, 
          bp.title, 
          bp.slug, 
          bp.excerpt,
          bp.featured_image as featuredImage,
          bp.view_count as viewCount,
          bp.published_at as publishedAt,
          bp.created_at as createdAt,
          u.id as authorId,
          u.full_name as authorFullName,
          u.avatar_url as authorAvatarUrl
        FROM blog_posts bp
        JOIN users u ON bp.author_id = u.id
        WHERE bp.status = 'published' 
        AND bp.is_deleted = FALSE
        ${excludeId ? 'AND bp.id != ?' : ''}
        ORDER BY bp.view_count DESC, bp.published_at DESC
        LIMIT ?
      `,
      args: excludeId 
        ? [excludeId, limit] 
        : [limit]
    });

    // Transform the data
    const posts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      featuredImage: row.featuredImage,
      viewCount: row.viewCount,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      author: {
        id: row.authorId,
        fullName: row.authorFullName,
        avatarUrl: row.authorAvatarUrl
      }
    }));

    return NextResponse.json({ posts });
    
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending posts' },
      { status: 500 }
    );
  }
}