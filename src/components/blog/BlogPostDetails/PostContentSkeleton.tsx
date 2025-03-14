import React from 'react';
import { motion } from 'framer-motion';

import styles from './BlogPostDetail.module.scss';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

const PostContentSkeleton: React.FC = () => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.featuredImage}
      >
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={400}
          animation="pulse"
        />
      </motion.div>

      <div className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Skeleton 
            variant="text" 
            width="85%" 
            height={48}
            animation="pulse"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.content}
      >
        <div className={styles.excerpt}>
          <Skeleton 
            variant="text" 
            width="100%" 
            height={20}
            animation="pulse"
          />
          <Skeleton 
            variant="text" 
            width="95%" 
            height={20}
            animation="pulse"
          />
          <Skeleton 
            variant="text" 
            width="90%" 
            height={20}
            animation="pulse"
          />
        </div>

        <div className={styles.body}>
          {Array(8).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {index % 3 === 0 && (
                <Skeleton 
                  variant="text" 
                  width="50%" 
                  height={28}
                  animation="pulse"
                  className="mb-4"
                />
              )}
              
              <Skeleton 
                variant="text" 
                width="100%" 
                height={16}
                animation="pulse"
              />
              <Skeleton 
                variant="text" 
                width="100%" 
                height={16}
                animation="pulse"
              />
              <Skeleton 
                variant="text" 
                width="95%" 
                height={16}
                animation="pulse"
              />
              <Skeleton 
                variant="text" 
                width="98%" 
                height={16}
                animation="pulse"
                className="mb-4"
              />
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default PostContentSkeleton;