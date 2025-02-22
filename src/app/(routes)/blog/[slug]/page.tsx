// src/app/(routes)/blog/[slug]/page.tsx
import React from 'react';
import { createClient } from '@libsql/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Define a type for the blog post data
interface BlogPostData {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  meta_description: string | null;
  featured_image: string | null;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          b.id,
          b.title,
          b.content,
          b.excerpt,
          b.meta_description,
          b.featured_image,
          b.author_id,
          b.status,
          b.published_at,
          b.created_at,
          u.first_name,
          u.last_name,
          u.full_name,
          u.avatar_url
        FROM blog_posts b
        LEFT JOIN users u ON b.author_id = u.id
        WHERE b.slug = ? AND b.is_deleted = FALSE
      `,
      args: [slug]
    });

    if (!result.rows.length) {
      return null;
    }

    // Cast the row to our BlogPostData type
    return result.rows[0] as unknown as BlogPostData;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: String(post.title),
    description: post.meta_description || post.excerpt || `Read ${post.title} on our blog.`
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const publishDate = post.published_at || post.created_at;
  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl dark:prose-invert mx-auto">
        <h1 className="text-4xl font-bold mb-6">{String(post.title)}</h1>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            {post.avatar_url && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={post.avatar_url}
                  alt={post.full_name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              By {post.full_name || 'Anonymous'}
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
        <div 
          className="prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: String(post.content) }} 
        />
      </article>
    </div>
  );
}