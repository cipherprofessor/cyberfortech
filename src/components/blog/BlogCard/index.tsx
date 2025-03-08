// src/components/blog/BlogCard/index.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { ExternalLink } from 'lucide-react';

import styles from './BlogCard.module.scss';
import clsx from 'clsx';
import { BlogPost } from '@/types/blog';


interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, className }) => {
  const { theme } = useTheme();
  
  const formatDate = (date: Date): string => {
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Default placeholder image if post doesn't have one
  const imageUrl = post.featuredImage || '/api/placeholder/400/300';
  
  // Get category and tag chips for display
  const primaryCategory = post.categories && post.categories.length > 0 
    ? post.categories[0] 
    : null;
  
  const primaryTag = post.tags && post.tags.length > 0 
    ? post.tags[0] 
    : null;

  // Calculate read time based on content length (roughly 200 words per minute)
  const calculateReadTime = () => {
    if (!post.content) return 1;
    const wordCount = post.content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return readTime > 0 ? readTime : 1;
  };

  const readTime = calculateReadTime();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        styles.card,
        theme === 'dark' && styles.dark,
        className
      )}
      data-testid="blog-card"
    >
      <div className={styles.imageContainer}>
        <Image 
          src={imageUrl} 
          alt={post.title}
          className={styles.image}
          width={400}
          height={300}
          priority={post.isFeatured}
        />
        
        <div className={styles.categoryTags}>
          {primaryCategory && (
            <Link 
              href={`/blog/category/${primaryCategory.slug}`}
              className={styles.categoryTag}
              onClick={(e) => e.stopPropagation()}
            >
              {primaryCategory.name.toUpperCase()}
            </Link>
          )}
          
          {primaryTag && (
            <Link 
              href={`/blog/tag/${primaryTag.slug}`}
              className={styles.categoryTag}
              onClick={(e) => e.stopPropagation()}
            >
              {primaryTag.name.toUpperCase()}
            </Link>
          )}
          
          {readTime > 0 && (
            <span className={styles.readTime}>{readTime} Min Read</span>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <Link 
            href={`/blog/author/${post.author.id}`}
            className={styles.author}
          >
            {post.author.fullName}
          </Link>
          <span className={styles.dateDivider}>on</span>
          <time className={styles.date}>
            {formatDate(post.publishedAt || post.createdAt)}
          </time>
        </div>
        
        <h2 className={styles.title}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        
        {post.excerpt && (
          <p className={styles.excerpt}>{post.excerpt}</p>
        )}
        
        <div className={styles.footer}>
          <Link 
            href={`/blog/${post.slug}`} 
            className={styles.readMoreButton}
          >
            Discover More
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;