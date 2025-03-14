import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogPostDetail.module.scss';


import Skeleton from '@/components/ui/Skeleton/Skeleton';
import BlogSidebarSkeleton from './BlogSideBar/BlogSidebarSkeleton';
import PostContentSkeleton from './PostContentSkeleton';

const BlogPostDetailSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={clsx(styles.pageContainer, theme === 'dark' && styles.dark)}>
      <div className={styles.contentWrapper}>
        {/* Main Content */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.mainContent}
        >
          <PostContentSkeleton />
          
          {/* Tags and Categories */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.taxonomy}
          >
            <div className={styles.categories}>
              <h3 className={styles.taxonomyTitle}>Categories</h3>
              <div className={styles.categoryList}>
                {Array(3).fill(0).map((_, index) => (
                  <Skeleton 
                    key={index}
                    variant="rounded" 
                    width={100} 
                    height={32}
                    animation="pulse"
                    className={styles.categoryLink}
                  />
                ))}
              </div>
            </div>

            <div className={styles.tags}>
              <h3 className={styles.taxonomyTitle}>Tags</h3>
              <div className={styles.tagList}>
                {Array(5).fill(0).map((_, index) => (
                  <Skeleton 
                    key={index}
                    variant="rounded" 
                    width={80} 
                    height={28}
                    animation="pulse"
                    className={styles.tagLink}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.5,
              ease: "easeOut"
            }}
            className={styles.commentsWrapper}
          >
            <h3 className={styles.commentsTitle}>Comments</h3>
            <div className={styles.commentsList}>
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className={styles.commentItem} style={{ marginBottom: '1.5rem' }}>
                  <div className={styles.commentHeader} style={{ display: 'flex', marginBottom: '0.5rem' }}>
                    <Skeleton 
                      variant="circular" 
                      width={40} 
                      height={40}
                      animation="pulse"
                    />
                    <div style={{ marginLeft: '0.75rem' }}>
                      <Skeleton 
                        variant="text" 
                        width={120} 
                        height={16}
                        animation="pulse"
                      />
                      <Skeleton 
                        variant="text" 
                        width={80} 
                        height={14}
                        animation="pulse"
                      />
                    </div>
                  </div>
                  <div className={styles.commentBody}>
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
                      width="90%" 
                      height={16}
                      animation="pulse"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.article>

        {/* Sidebar */}
        <BlogSidebarSkeleton />
      </div>
    </div>
  );
};

export default BlogPostDetailSkeleton;