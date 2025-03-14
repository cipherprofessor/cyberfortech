import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug } from '@/services/blog-service';
import BlogPostDetail from '@/components/blog/BlogPostDetails/BlogPostDetail';

import { getCurrentUser } from '@/lib/clerk';
import BlogPostDetailSkeleton from '@/components/blog/BlogPostDetails/BlogPostDetailSkeleton';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
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
  const [post, currentUser] = await Promise.all([
    getPostBySlug((await params).slug),
    getCurrentUser()
  ]);

  if (!post) {
    notFound();
  }

  const isAuthor = currentUser?.id === post.authorId;
  const userRole = currentUser?.role;

  return (
    <Suspense fallback={<BlogPostLoading />}>
      <BlogPostDetail 
        post={post} 
        currentUserRole={userRole} 
        isAuthor={isAuthor}
      />
    </Suspense>
  );
}