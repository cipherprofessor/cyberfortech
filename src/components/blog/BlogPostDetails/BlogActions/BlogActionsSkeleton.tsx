// src/components/blog/BlogActions/BlogActionsSkeleton.tsx

import React from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

import styles from './BlogActions.module.scss';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

const BlogActionsSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={clsx(styles.actionsContainer, theme === 'dark' && styles.dark)}>
      <div className={styles.actionGroup}>
        {/* Admin action skeletons */}
        <Skeleton width={80} height={36} variant="rounded" />
        <Skeleton width={80} height={36} variant="rounded" />
      </div>
      
      <div className={styles.actionGroup}>
        {/* Like button skeleton */}
        <Skeleton width={60} height={36} variant="rounded" />
        
        {/* Bookmark button skeleton */}
        <Skeleton width={80} height={36} variant="rounded" />
        
        {/* Share button skeleton */}
        <Skeleton width={60} height={36} variant="rounded" />
      </div>
    </div>
  );
};

export default BlogActionsSkeleton;