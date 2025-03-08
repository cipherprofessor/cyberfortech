// src/app/(routes)/blog/[slug]/page.tsx
import React, { Suspense } from 'react';
import { createClient } from '@libsql/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';
import BlogPostDetail from '../../../../components/blog/BlogPostDetails/BlogPostDetail';
import { getCurrentUser } from '@/lib/clerk';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Function to get post data
async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          b.id,
          b.title,
          b.slug,
          b.content,
          b.excerpt,
          b.featured_image,
          b.meta_title,
          b.meta_description,
          b.author_id,
          b.status,
          b.view_count,
          b.is_featured,
          b.published_at,
          b.created_at,
          b.updated_at,
          u.first_name,
          u.last_name,
          u.full_name,
          u.avatar_url,
          u.role,
          GROUP_CONCAT(DISTINCT bc.id || '::' || bc.name || '::' || bc.slug) as categories,
          GROUP_CONCAT(DISTINCT bt.id || '::' || bt.name || '::' || bt.slug) as tags
        FROM blog_posts b
        LEFT JOIN users u ON b.author_id = u.id
        LEFT JOIN blog_post_categories bpc ON b.id = bpc.post_id
        LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
        LEFT JOIN blog_post_tags bpt ON b.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE b.slug = ? 
        AND b.is_deleted = FALSE
        GROUP BY b.id
      `,
      args: [slug]
    });

    if (!result.rows.length) {
      return null;
    }

    const row = result.rows[0];

    // Increment view count
    await client.execute({
      sql: `
        UPDATE blog_posts 
        SET view_count = view_count + 1 
        WHERE id = ?
      `,
      args: [row.id]
    });

    return {
      id: String(row.id),
      title: String(row.title),
      slug: String(row.slug),
      content: String(row.content),
      excerpt: row.excerpt ? String(row.excerpt) : undefined,
      featuredImage: row.featured_image ? String(row.featured_image) : undefined,
      authorId: String(row.author_id),
      status: String(row.status) as 'draft' | 'published' | 'archived',
      viewCount: Number(row.view_count || 0),
      isFeatured: Boolean(row.is_featured),
      metaTitle: row.meta_title ? String(row.meta_title) : undefined,
      metaDescription: row.meta_description ? String(row.meta_description) : undefined,
      publishedAt: row.published_at ? new Date(String(row.published_at)) : undefined,
      createdAt: new Date(String(row.created_at)),
      updatedAt: new Date(String(row.updated_at)),
      categories: row.categories 
        ? String(row.categories).split(',').map(cat => {
            const [id, name, slug] = cat.split('::');
            return { id, name, slug, displayOrder: 0 };
          })
        : [],
      tags: row.tags
        ? String(row.tags).split(',').map(tag => {
            const [id, name, slug] = tag.split('::');
            return { id, name, slug };
          })
        : [],
      author: {
        id: String(row.author_id),
        firstName: String(row.first_name || ''),
        lastName: String(row.last_name || ''),
        fullName: String(row.full_name || ''),
        avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
        role: String(row.role || 'author')
      }
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
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

// The main page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, currentUser] = await Promise.all([
    getPost((await params).slug),
    getCurrentUser()
  ]);

  if (!post) {
    notFound();
  }

  const isAuthor = currentUser?.id === post.authorId;
  const userRole = currentUser?.role;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPostDetail 
        post={post} 
        currentUserRole={userRole} 
        isAuthor={isAuthor}
      />
    </Suspense>
  );
}