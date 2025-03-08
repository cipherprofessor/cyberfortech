// src/components/blog/BlogSkeleton/index.tsx
"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogSkeleton.module.scss';

interface BlogSkeletonProps {
  count?: number;
  className?: string;
}

const BlogSkeleton: React.FC<BlogSkeletonProps> = ({ count = 3, className }) => {
  const { theme } = useTheme();
  
  return (
    <div className={clsx(styles.container, theme === 'dark' && styles.dark, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.header}>
            <div className={styles.content}>
              <div className={styles.title}></div>
              <div className={styles.excerpt}></div>
              <div className={styles.chips}>
                <div className={styles.chip}></div>
                <div className={styles.chip}></div>
                <div className={styles.chip}></div>
              </div>
            </div>
            <div className={styles.thumbnail}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;