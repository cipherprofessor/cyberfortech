// src/components/Blog/BlogSkeleton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './BlogSkeleton.module.scss';
import clsx from 'clsx';

interface BlogSkeletonProps {
  count?: number;
  className?: string;
}

const BlogSkeleton: React.FC<BlogSkeletonProps> = ({ count = 7, className }) => {
  return (
    <div className={clsx(styles.skeleton, className)}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton} />
        <div className={styles.buttonSkeleton} />
      </div>

      <div className={styles.postList}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={styles.postCard}
          >
            <div className={styles.postHeader}>
              <div className={styles.titleSection}>
                {/* Title skeleton */}
                <div className={styles.title} />

                {/* Chips skeleton */}
                <div className={styles.chips}>
                  <div className={styles.chip} />
                  <div className={styles.chip} />
                  <div className={styles.chip} />
                  <div className={styles.chip} />
                </div>
              </div>

              {/* Expand button skeleton */}
              <div className={styles.expandButton} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogSkeleton;