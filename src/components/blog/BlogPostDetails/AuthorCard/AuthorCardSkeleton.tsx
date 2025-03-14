import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './AuthorCard.module.scss';

const AuthorCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={clsx(styles.authorCard, theme === 'dark' && styles.dark)}
    >
      <div className={styles.authorHeader}>
        <h3 className={styles.sectionTitle}>About the Author</h3>
      </div>
      
      <div className={styles.authorProfile}>
        <div className={styles.avatarWrapper}>
          <Skeleton 
            variant="circular" 
            width={80} 
            height={80}
            animation="pulse"
          />
        </div>
        
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>
            <Skeleton 
              variant="text" 
              width="70%" 
              height={24}
              animation="pulse"
            />
          </div>
          
          <div className={styles.authorStats}>
            <Skeleton 
              variant="text" 
              width="40%" 
              height={16}
              animation="pulse"
            />
          </div>
          
          <div className={styles.authorBio}>
            <Skeleton 
              variant="text" 
              width="100%" 
              height={16}
              animation="pulse"
            />
            <Skeleton 
              variant="text" 
              width="90%" 
              height={16}
              animation="pulse"
            />
            <Skeleton 
              variant="text" 
              width="95%" 
              height={16}
              animation="pulse"
            />
          </div>
          
          <div className={styles.socialLinks}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton 
                key={i}
                variant="circular" 
                width={32} 
                height={32}
                animation="pulse"
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.viewProfileButton}>
        <Skeleton 
          variant="rounded" 
          width="100%" 
          height={40}
          animation="pulse"
        />
      </div>
    </motion.div>
  );
};

export default AuthorCardSkeleton;