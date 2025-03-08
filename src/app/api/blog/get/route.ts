// src/app/api/blog/route.ts - GET Handler
import { NextResponse } from 'next/server';
import { getPosts } from '@/services/blog-service';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published'; // Default to published
    
    // Fetch posts with filters
    const result = await getPosts({
      page,
      limit,
      category,
      tag,
      search,
      status
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}