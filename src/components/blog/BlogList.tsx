// src/components/Blog/BlogList.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { BlogListProps } from '@/types/blog';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, User, Eye, Star, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './BlogList.module.scss';

const BlogList: React.FC<BlogListProps> = ({
  posts,
  loading,
  error,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  const { theme } = useTheme();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  if (loading) {
    return (
      <div className={`${styles.loading} ${className}`}>
        <div className={styles.spinner} />
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''} ${className}`}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Blog Posts</h1>
        <Link href="/blog/new" className={styles.createButton}>
          Create New Post
        </Link>
      </div>

      <div className={styles.postList}>
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`${styles.postCard} ${expandedPost === post.id ? styles.expanded : ''}`}
              onClick={() => handleCardClick(post.id)}
            >
              <div className={styles.postHeader}>
                <div className={styles.titleSection}>
                  <h2 className={styles.title}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className={styles.chips}>
                    {post.isFeatured && (
                      <span className={`${styles.chip} ${styles.featured}`}>
                        <Star size={14} />
                        Featured
                      </span>
                    )}
                    <span className={styles.chip}>
                      <User size={14} />
                      {post.author.fullName}
                    </span>
                    <span className={styles.chip}>
                      <Calendar size={14} />
                      {format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className={styles.chip}>
                      <Eye size={14} />
                      {post.viewCount} views
                    </span>
                  </div>
                </div>
                <button 
                  className={styles.expandButton}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick(post.id);
                  }}
                >
                  {expandedPost === post.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              <AnimatePresence>
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.expandedContent}
                  >
                    {post.excerpt && (
                      <p className={styles.excerpt}>{post.excerpt}</p>
                    )}
                    
                    <div className={styles.tagsSection}>
                      {post.categories.length > 0 && (
                        <div className={styles.tagGroup}>
                          <span className={styles.tagLabel}>Categories:</span>
                          <div className={styles.tags}>
                            {post.categories.map(category => (
                              <Link
                                key={category.id}
                                href={`/blog/category/${category.slug}`}
                                className={`${styles.tag} ${styles.categoryTag}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {post.tags.length > 0 && (
                        <div className={styles.tagGroup}>
                          <span className={styles.tagLabel}>Tags:</span>
                          <div className={styles.tags}>
                            {post.tags.map(tag => (
                              <Link
                                key={tag.id}
                                href={`/blog/tag/${tag.slug}`}
                                className={styles.tag}
                                onClick={(e) => e.stopPropagation()}
                              >
                                #{tag.name}
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
                        Read More
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;