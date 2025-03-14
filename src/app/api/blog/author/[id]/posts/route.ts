import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '3', 10);
    const excludeId = searchParams.get('exclude') || '';
    
    // Fetch posts by author excluding the current post
    const result = await client.execute({
      sql: `
        SELECT 
          bp.id, 
          bp.title, 
          bp.slug, 
          bp.excerpt, 
          bp.featured_image as featuredImage,
          bp.published_at as publishedAt, 
          bp.created_at as createdAt,
          bp.view_count as viewCount,
          u.id as authorId,
          u.full_name as authorFullName,
          u.avatar_url as authorAvatarUrl
        FROM blog_posts bp
        JOIN users u ON bp.author_id = u.id
        WHERE bp.author_id = ? 
        AND bp.status = 'published' 
        AND bp.is_deleted = FALSE
        ${excludeId ? 'AND bp.id != ?' : ''}
        ORDER BY bp.published_at DESC, bp.created_at DESC
        LIMIT ?
      `,
      args: excludeId 
        ? [id, excludeId, limit] 
        : [id, limit]
    });

    // Transform the data
    const posts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      featuredImage: row.featuredImage,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      viewCount: row.viewCount,
      author: {
        id: row.authorId,
        fullName: row.authorFullName,
        avatarUrl: row.authorAvatarUrl
      }
    }));

    return NextResponse.json({ posts });
    
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author posts' },
      { status: 500 }
    );
  }
}