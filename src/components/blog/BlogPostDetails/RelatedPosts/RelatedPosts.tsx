import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './RelatedPosts.module.scss';
import { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  title: string;
  posts: BlogPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ title, posts }) => {
  const { theme } = useTheme();
  
  if (!posts || posts.length === 0) {
    return null;
  }
  
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
        {posts.map(post => (
          <div key={post.id} className={styles.postItem}>
            <div className={styles.postImageWrapper}>
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={100}
                  height={60}
                  className={styles.postImage}
                />
              ) : (
                <div className={styles.imagePlaceholder} />
              )}
            </div>
            
            <div className={styles.postInfo}>
              <h4 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h4>
              
              <span className={styles.postDate}>
                {format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedPosts;