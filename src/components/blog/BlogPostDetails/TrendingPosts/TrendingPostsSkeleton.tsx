import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './TrendingPosts.module.scss';

interface TrendingPostsSkeletonProps {
  count?: number;
}

const TrendingPostsSkeleton: React.FC<TrendingPostsSkeletonProps> = ({ 
  count = 5 
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={clsx(styles.trendingPosts, theme === 'dark' && styles.dark)}
    >
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>
          <TrendingUp size={16} className={styles.trendingIcon} />
          Trending Posts
        </h3>
      </div>
      
      <div className={styles.postList}>
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className={styles.postItem}>
            <div className={styles.postIndex}>{index + 1}</div>
            
            <div className={styles.postInfo}>
              <div className={styles.postTitle}>
                <Skeleton 
                  variant="text" 
                  width="95%" 
                  height={16}
                  animation="pulse"
                />
                <Skeleton 
                  variant="text" 
                  width="75%" 
                  height={16}
                  animation="pulse"
                />
              </div>
              
              <div className={styles.postMeta}>
                <Skeleton 
                  variant="text" 
                  width={70} 
                  height={14}
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

export default TrendingPostsSkeleton;