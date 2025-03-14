import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Eye } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './TrendingPosts.module.scss';
import { BlogPost } from '@/types/blog';

interface TrendingPostsProps {
  posts: BlogPost[];
}

const TrendingPosts: React.FC<TrendingPostsProps> = ({ posts }) => {
  const { theme } = useTheme();
  
  if (!posts || posts.length === 0) {
    return null;
  }
  
  // Sort posts by view count
  const sortedPosts = [...posts].sort((a, b) => b.viewCount - a.viewCount);
  
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
        {sortedPosts.map((post, index) => (
          <div key={post.id} className={styles.postItem}>
            <div className={styles.postIndex}>{index + 1}</div>
            
            <div className={styles.postInfo}>
              <h4 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h4>
              
              <div className={styles.postMeta}>
                <span className={styles.viewCount}>
                  <Eye size={14} />
                  {post.viewCount} views
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrendingPosts;