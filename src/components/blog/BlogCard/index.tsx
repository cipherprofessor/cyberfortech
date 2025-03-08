// src/components/blog/BlogCard/index.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { 
  Calendar, 
  User, 
  Eye, 
  Star, 
  Clock, 
  Tag, 
  ChevronDown, 
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import styles from './BlogCard.module.scss';
import clsx from 'clsx';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, className }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    return text.length <= maxLength 
      ? text 
      : `${text.substring(0, maxLength)}...`;
  };

  const formatDate = (date: Date): string => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (date: Date): string => {
    try {
      return format(new Date(date), 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        styles.card,
        expanded && styles.expanded,
        theme === 'dark' && styles.dark,
        className
      )}
      data-testid="blog-card"
    >
      <motion.div 
        layout="position"
        className={styles.cardHeader}
        onClick={toggleExpand}
      >
        <div className={styles.titleSection}>
          <motion.h2 layout="position" className={styles.title}>
            <Link href={`/blog/${post.slug}`} onClick={(e) => e.stopPropagation()}>
              {post.title}
            </Link>
          </motion.h2>
          
          {!expanded && post.excerpt && (
            <motion.p layout="position" className={styles.previewExcerpt}>
              {truncateText(post.excerpt, 150)}
            </motion.p>
          )}

          <motion.div layout="position" className={styles.chips}>
            {post.isFeatured && (
              <span className={clsx(styles.chip, styles.featured)}>
                <Star size={14} />
                Featured
              </span>
            )}
            <span className={styles.chip}>
              <Calendar size={14} />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className={styles.chip}>
              <Clock size={14} />
              {formatTime(post.publishedAt || post.createdAt)}
            </span>
            <span className={styles.chip}>
              <User size={14} />
              {post.author.fullName}
            </span>
            <span className={styles.chip}>
              <Eye size={14} />
              {post.viewCount} views
            </span>
          </motion.div>
        </div>

        {post.featuredImage && (
          <div className={styles.thumbnailContainer}>
            <Image 
              src={post.featuredImage} 
              alt={post.title}
              className={styles.thumbnail}
              width={120}
              height={80}
              priority={post.isFeatured}
            />
          </div>
        )}

        <button 
          className={styles.expandButton}
          onClick={toggleExpand}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse post" : "Expand post"}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={styles.expandedContent}
          >
            {post.excerpt && (
              <p className={styles.excerpt}>{post.excerpt}</p>
            )}

            <div className={styles.tagsContainer}>
              {post.categories?.length > 0 && (
                <div className={styles.tagGroup}>
                  <span className={styles.tagLabel}>Categories</span>
                  <div className={styles.tags}>
                    {post.categories.map(category => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.slug}`}
                        className={clsx(styles.tag, styles.categoryTag)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {post.tags?.length > 0 && (
                <div className={styles.tagGroup}>
                  <span className={styles.tagLabel}>Tags</span>
                  <div className={styles.tags}>
                    {post.tags.map(tag => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className={styles.tag}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tag size={12} />
                        <span>{tag.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.cardActions}>
              <Link
                href={`/blog/${post.slug}`}
                className={styles.readMoreButton}
                onClick={(e) => e.stopPropagation()}
              >
                Read Full Post
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlogCard;