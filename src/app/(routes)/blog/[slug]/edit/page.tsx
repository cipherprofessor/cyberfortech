// src/app/(routes)/blog/[slug]/edit/page.tsx
"use client";

import React from 'react';
import BlogProvider from '@/contexts/BlogContext';
import { createClient } from '@libsql/client';
import { notFound, useRouter } from 'next/navigation';
import { Metadata } from 'next';
import BlogEditor from '@/components/blog/BlogEditor/BlogEditor';
import { BlogPost } from '@/types/blog';
import { useBlogOperations } from '@/hooks/useBlogOperations';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface EditBlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          b.*,
          u.first_name,
          u.last_name,
          u.full_name,
          u.avatar_url,
          GROUP_CONCAT(DISTINCT bc.id || '::' || bc.name || '::' || bc.slug) as categories,
          GROUP_CONCAT(DISTINCT bt.id || '::' || bt.name || '::' || bt.slug) as tags
        FROM blog_posts b
        LEFT JOIN users u ON b.author_id = u.id
        LEFT JOIN blog_post_categories bpc ON b.id = bpc.post_id
        LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
        LEFT JOIN blog_post_tags bpt ON b.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE b.slug = ? AND b.is_deleted = FALSE
        GROUP BY b.id
      `,
      args: [slug]
    });

    if (!result.rows.length) {
      return null;
    }

    const row = result.rows[0];
    
    const blogPost: BlogPost = {
      id: row.id as string,
      title: row.title as string,
      slug: row.slug as string,
      content: row.content as string,
      excerpt: row.excerpt as string | undefined,
      featuredImage: row.featured_image as string | undefined,
      authorId: row.author_id as string,
      status: row.status as 'draft' | 'published' | 'archived',
      viewCount: Number(row.view_count),
      isFeatured: Boolean(row.is_featured),
      metaTitle: row.meta_title as string | undefined,
      metaDescription: row.meta_description as string | undefined,
      publishedAt: row.published_at ? new Date(row.published_at as string) : undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
      likeCount: Number(row.like_count || 0), // Added likeCount property
      categories: row.categories ? (row.categories as string).split(',').map((cat: string) => {
        const [id, name, slug] = cat.split('::');
        return { id, name, slug, displayOrder: 0 };
      }) : [],
      tags: row.tags ? (row.tags as string).split(',').map((tag: string) => {
        const [id, name, slug] = tag.split('::');
        return { id, name, slug };
      }) : [],
      author: {
        id: row.author_id as string,
        firstName: row.first_name as string,
        lastName: row.last_name as string,
        fullName: row.full_name as string,
        avatarUrl: row.avatar_url as string | undefined,
        role: 'author'
      }
    };

    return blogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

function EditBlogPostContent({ post }: { post: BlogPost }) {
  const router = useRouter();
  const { handleUpdatePost } = useBlogOperations();

  const handleSave = async (updatedPost: Partial<BlogPost>) => {
    await handleUpdatePost(post.slug, updatedPost);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogEditor 
        post={post} 
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogProvider>
      <EditBlogPostContent post={post} />
    </BlogProvider>
  );
}