import React from 'react';
import { motion } from 'framer-motion';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './PostMeta.module.scss';

const PostMetaSkeleton: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={styles.metadata}
    >
      <div className={styles.authorInfo}>
        <div className={styles.authorLink}>
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40}
            animation="pulse"
          />
          
          <div className={styles.authorMeta}>
            <div className={styles.authorName}>
              <Skeleton 
                variant="text" 
                width={120} 
                height={16}
                animation="pulse"
              />
            </div>
            
            <div className={styles.postMeta}>
              <Skeleton 
                variant="text" 
                width={240} 
                height={14}
                animation="pulse"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostMetaSkeleton;