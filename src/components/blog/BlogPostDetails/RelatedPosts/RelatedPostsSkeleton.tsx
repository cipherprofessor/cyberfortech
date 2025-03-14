import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './RelatedPosts.module.scss';

interface RelatedPostsSkeletonProps {
  title: string;
  count?: number;
}

const RelatedPostsSkeleton: React.FC<RelatedPostsSkeletonProps> = ({ 
  title, 
  count = 3 
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={clsx(styles.relatedPosts, theme === 'dark' && styles.dark)}
    >
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      
      <div className={styles.postList}>
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className={styles.postItem}>
            <div className={styles.postImageWrapper}>
              <Skeleton 
                variant="rounded" 
                width={80} 
                height={60}
                animation="pulse"
              />
            </div>
            
            <div className={styles.postInfo}>
              <div className={styles.postTitle}>
                <Skeleton 
                  variant="text" 
                  width="90%" 
                  height={16}
                  animation="pulse"
                />
                <Skeleton 
                  variant="text" 
                  width="70%" 
                  height={16}
                  animation="pulse"
                />
              </div>
              
              <div className={styles.postDate}>
                <Skeleton 
                  variant="text" 
                  width={80} 
                  height={12}
                  animation="pulse"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedPostsSkeleton;