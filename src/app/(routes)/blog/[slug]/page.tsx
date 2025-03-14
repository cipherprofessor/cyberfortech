import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getOptimizedPostBySlug, getOptimizedAuthorPosts, getOptimizedTrendingPosts } from '@/services/blog-optimized-service';
import BlogPostDetail from '@/components/blog/BlogPostDetails/BlogPostDetail';

import { getCurrentUser } from '@/lib/clerk';
import BlogPostDetailSkeleton from '@/components/blog/BlogPostDetails/BlogPostDetailSkeleton';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getOptimizedPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt || `Read ${post.title} on our blog.`,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || `Read ${post.title} on our blog.`,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
      type: 'article',
      authors: [post.author.fullName || ''],
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    }
  };
}

// Loading component that uses our skeleton
function BlogPostLoading() {
  return <BlogPostDetailSkeleton />;
}

// The main page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getOptimizedPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isAuthor = currentUser?.id === post.authorId;
  const userRole = currentUser?.role;

  // Preload data for client-side Redux store
  // This doesn't actually update the Redux store yet (that happens client-side)
  // but it warms up the cache and can be used for SSR in the future
  await Promise.all([
    getOptimizedAuthorPosts(post.author.id, 3, post.id),
    getOptimizedTrendingPosts(5, post.id)
  ]);

  // Add link preload hints for critical resources
  const linkPreloads = [
    // Preload the API endpoints that will be called immediately
    <link key="author-posts-preload" rel="preload" href={`/api/blog/author/${post.author.id}/posts?limit=3&exclude=${post.id}`} as="fetch" crossOrigin="anonymous" />,
    <link key="trending-posts-preload" rel="preload" href={`/api/blog/trending?limit=5&exclude=${post.id}`} as="fetch" crossOrigin="anonymous" />
  ];

  // If user is logged in, also preload interactions
  if (currentUser?.id) {
    linkPreloads.push(
      <link key="interactions-preload" rel="preload" href={`/api/blog/posts/${post.id}/interactions?userId=${currentUser.id}`} as="fetch" crossOrigin="anonymous" />
    );
  }

  return (
    <>
      {/* Add preload link tags */}
      {linkPreloads}
      
      <Suspense fallback={<BlogPostLoading />}>
        <BlogPostDetail 
          post={post} 
          currentUserRole={userRole} 
          isAuthor={isAuthor}
        />
      </Suspense>
    </>
  );
}