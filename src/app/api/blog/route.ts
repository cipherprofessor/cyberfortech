// src/app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import { 
  createPost, 
  ensureUserExists, 
  getPosts 
} from '@/services/blog-service';

/**
 * GET handler for fetching blog posts with pagination and filtering
 */
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

/**
 * POST handler for creating new blog posts
 */
export async function POST(request: Request) {
  try {
    // Authenticate user
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN, 
      ROLES.SUPERADMIN, 
      ROLES.STUDENT, 
      ROLES.INSTRUCTOR
    ]);

    console.log("Auth result:", { isAuthorized, user: !!user, error, role: user?.role });
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      role: user.role
    });

    // Parse request body
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      status = 'draft',
      isFeatured = false,
      metaTitle,
      metaDescription,
      categories = [],
      tags = []
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create blog post
    const result = await createPost({
      title,
      content,
      excerpt,
      status,
      isFeatured,
      metaTitle,
      metaDescription,
      categories,
      tags,
      authorId: user.id
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: result.id, slug: result.slug });

  } catch (error) {
    console.error('Error creating blog post:', error);

    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'A blog post with this title already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}