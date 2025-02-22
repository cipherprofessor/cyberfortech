// src/app/(routes)/blog/[slug]/page.tsx
import React from 'react';
import { createClient } from '@libsql/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

// Initialize the database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
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
    description: post.metaDescription || post.excerpt || `Read ${post.title} on our blog.`,
    openGraph: {
      title: String(post.title),
      description: post.metaDescription || post.excerpt || `Read ${post.title} on our blog.`,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
      type: 'article',
      authors: [post.author.fullName || ''],
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
    }
  };
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
        AND b.status = 'published'
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

// The main page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose lg:prose-xl dark:prose-invert mx-auto px-4 py-8">
      {post.featuredImage && (
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {post.author.avatarUrl && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.fullName || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span>By {post.author.fullName || 'Anonymous'}</span>
          </div>

          <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
            {format(
              post.publishedAt || post.createdAt,
              'MMMM d, yyyy'
            )}
          </time>

          <span>· {post.viewCount} views</span>
        </div>

        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            {post.excerpt}
          </p>
        )}
      </header>

      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        {(post.categories.length > 0 || post.tags.length > 0) && (
          <div className="flex flex-wrap gap-4">
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-600 dark:text-gray-400">Categories:</span>
                {post.categories.map(category => (
                  <a
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-600 dark:text-gray-400">Tags:</span>
                {post.tags.map(tag => (
                  <a
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}