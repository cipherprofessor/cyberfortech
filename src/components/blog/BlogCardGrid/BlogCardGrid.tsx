import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import styles from './BlogCardGrid.module.scss';
import ReadingTimeEstimator from '../ReadingTimeEstimator/ReadingTimeEstimator';

// Update this interface to match your actual BlogPost type in types/blog.ts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    fullName?: string;
    avatarUrl?: string;
    role?: string;
  };
  publishedAt: Date | string;
  createdAt?: Date | string;
  categories?: Array<{ id: string; name: string; slug: string }>;
  tags?: Array<{ id: string; name: string; slug: string }>;
}

interface BlogCardGridProps {
  post: BlogPost;
  index?: number;
  className?: string;
}

const BlogCardGrid: React.FC<BlogCardGridProps> = ({ 
  post, 
  index = 0,
  className 
}) => {
  // Format the date
  const formatDate = (date: Date | string): string => {
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formattedDate = formatDate(post.publishedAt || post.createdAt || new Date());
  
  // Calculate read time based on content length (roughly 200 words per minute)
  const calculateReadTime = () => {
    if (!post.content) return 1;
    const wordCount = post.content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return readTime > 0 ? readTime : 1;
  };

  const readTime = calculateReadTime();

  // Get the author's name, handling different possible structures
  const authorName = post.author.fullName || 
                     (post.author.firstName && post.author.lastName 
                      ? `${post.author.firstName} ${post.author.lastName}` 
                      : post.author.name) || 
                     'Unknown Author';

  // Animation variants for staggered children
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.1 // Stagger effect
      }
    }
  };

  // Get categories and tags for display
  const displayCategories = post.categories && post.categories.length > 0 
    ? post.categories.slice(0, 1) // Show only first category 
    : [];

  // Get author avatar URL with fallback
  const avatarUrl = post.author.avatarUrl || '/fallback/user.png';

  return (
    <motion.article 
      className={`${styles.card} ${className || ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className={styles.imageContainer}>
        <div className={styles.imageOverlay}></div>
        <img 
          src={post.featuredImage || '/blog/blog.webp'} 
          alt={post.title} 
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/blog/blog.webp'; // Fallback image
          }}
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
          
          {readTime > 0 && (
            <span className={styles.readTime}>{readTime} MIN READ</span>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        {/* Author at the top with avatar */}
        <div className={styles.meta}>
          <div className={styles.authorContainer}>
            <Link 
              href={`/blog/author/${post.author.id}`}
              className={styles.authorAvatarLink}
            >
              <img 
                src={avatarUrl} 
                alt={authorName} 
                className={styles.authorAvatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/fallback/user.png'; // Fallback avatar
                }}
              />
            </Link>
            <div className={styles.authorNameContainer}>
              <Link 
                href={`/blog/author/${post.author.id}`}
                className={styles.author}
              >
                {authorName}
              </Link>
              <span className={styles.dateDivider}>on</span>
              <time className={styles.date}>
                {formattedDate}
              </time>
            </div>
          </div>
        </div>
        
        <h2 className={styles.title}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        
        {post.excerpt && (
          <p className={styles.excerpt}>
            {post.excerpt}
          </p>
        )}
        
        {/* Tags section */}
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.slice(0, 2).map(tag => (
              <Link 
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className={styles.tag}
                onClick={(e) => e.stopPropagation()}
              >
                #{tag.name}
              </Link>
            ))}
            {post.tags.length > 2 && (
              <span className={styles.moreTags}>+{post.tags.length - 2}</span>
            )}
          </div>
        )}
        
        {/* Bottom row with Discover More */}
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

export default BlogCardGrid;