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
          <div className={styles.imageContainer}>
            <div className={styles.imageSkeleton}></div>
            <div className={styles.tagsSkeleton}>
              <div className={styles.tag}></div>
              <div className={styles.tag}></div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.metaSkeleton}></div>
            <div className={styles.titleSkeleton}></div>
            <div className={styles.excerptSkeleton}></div>
            <div className={styles.buttonSkeleton}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;