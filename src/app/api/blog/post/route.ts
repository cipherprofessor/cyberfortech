// src/app/api/blog/route.ts - POST Handler
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import { createPost, ensureUserExists } from '@/services/blog-service';

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN, 
      ROLES.SUPERADMIN, 
      ROLES.STUDENT, 
      ROLES.INSTRUCTOR
    ]);
    
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