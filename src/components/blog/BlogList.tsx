// src/components/Blog/BlogList.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { BlogListProps } from '@/types/blog';
import Link from 'next/link';
import { format } from 'date-fns';
import styles from './BlogList.module.scss';

const BlogList: React.FC<BlogListProps> = ({
  posts,
  loading,
  error,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  className = ''
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className={`${styles.loading} ${className}`}>
        <div className={styles.spinner} />
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.error} ${className}`} role="alert">
        {error}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={`${styles.empty} ${className}`}>
        No blog posts found.
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''} ${className}`}>
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={styles.post}
          >
            {post.featuredImage && (
              <div className={styles.imageWrapper}>
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className={styles.image}
                  loading="lazy"
                />
                {post.isFeatured && (
                  <span className={styles.featuredBadge}>Featured</span>
                )}
              </div>
            )}

            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.date}>
                  {format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}
                </span>
                <span className={styles.author}>
                  by {post.author.fullName}
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                <h2 className={styles.title}>{post.title}</h2>
              </Link>

              <p className={styles.excerpt}>{post.excerpt}</p>

              <div className={styles.footer}>
                <div className={styles.categories}>
                  {post.categories.map(category => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                      className={styles.category}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <div className={styles.tags}>
                  {post.tags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className={styles.tag}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

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