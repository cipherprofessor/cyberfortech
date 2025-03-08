// src/app/api/blog/[slug]/route.ts
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import { isAdmin } from '@/utils/auth';
import { 
  getPostBySlug, 
  updatePost, 
  deletePost, 
  checkPostPermission 
} from '@/services/blog-service';

/**
 * GET handler for fetching a single blog post by slug
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
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
    
    const { slug } = params;
    // Get post with view count increment
    const post = await getPostBySlug(slug, true);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating an existing blog post
 */
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Authenticate user
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN, 
      ROLES.SUPERADMIN,
      ROLES.INSTRUCTOR
    ]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { slug } = params;
    
    // Fetch the post first to check permissions
    const post = await getPostBySlug(slug, false); // false = don't increment view count
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to edit
    if (post.authorId !== user.id && !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Update the post
    const newSlug = await updatePost(post.id, body, slug);
    
    if (!newSlug) {
      return NextResponse.json(
        { error: 'Failed to update blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ slug: newSlug });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a blog post
 */
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Authenticate user
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN, 
      ROLES.SUPERADMIN
    ]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { slug } = params;
    
    // Fetch the post first to check permissions
    const post = await getPostBySlug(slug, false); // false = don't increment view count
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to delete
    if (post.authorId !== user.id && !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Delete the post (soft delete)
    const success = await deletePost(post.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}