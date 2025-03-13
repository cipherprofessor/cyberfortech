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
import ReadingTimeEstimator from '../ReadingTimeEstimator/ReadingTimeEstimator';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, className }) => {
  const { theme } = useTheme();
  
  const formatDate = (date: Date | string): string => {
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Default placeholder image if post doesn't have one
  const imageUrl = post.featuredImage || '/blog/blog.webp';
  
  // Get categories and tags for display (up to 3)
  const displayCategories = post.categories && post.categories.length > 0 
    ? post.categories.slice(0, 1) // Show only first category 
    : [];
  
  const displayTags = post.tags && post.tags.length > 0 
    ? post.tags.slice(0, 2) // Show up to 2 tags (plus 1 category = 3 chips total)
    : [];

  // Truncate excerpt to appropriate length
  const truncateExcerpt = (text: string, maxLength: number = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Get author avatar URL with fallback
  const avatarUrl = post.author.avatarUrl || '/default-avatar.png';

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
          {displayCategories.map((category) => (
            <Link 
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className={styles.categoryTag}
              onClick={(e) => e.stopPropagation()}
            >
              {category.name.toUpperCase()}
            </Link>
          ))}
          
          {displayTags.map((tag) => (
            <Link 
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className={clsx(styles.categoryTag, styles.tagChip)}
              onClick={(e) => e.stopPropagation()}
            >
              {tag.name.toUpperCase()}
            </Link>
          ))}
          
          {/* Replace the manual read time calculation with ReadingTimeEstimator */}
          <span className={styles.readTime}>
            <ReadingTimeEstimator 
              content={post.content} 
              className={styles.readingTimeEstimator}
              minLength={1}
            />
          </span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.authorContainer}>
          <Link 
            href={`/blog/author/${post.author.id}`}
            className={styles.authorAvatarLink}
          >
            <img 
              src={avatarUrl} 
              alt={post.author.fullName} 
              className={styles.authorAvatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png'; // Fallback avatar
              }}
            />
          </Link>
          
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
        </div>
        
        <h2 className={styles.title}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        
        {post.excerpt && (
          <p className={styles.excerpt}>
            {truncateExcerpt(post.excerpt)}
          </p>
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