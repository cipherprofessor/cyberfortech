import React from 'react';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './BlogCardGrid.module.scss';
import ReadingTimeEstimator from '../ReadingTimeEstimator/ReadingTimeEstimator';

// Update this interface to match your actual BlogPost type in types/blog.ts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string; // Make excerpt optional
  content: string;
  featuredImage?: string; // Make featuredImage optional
  author: {
    name: string;
    avatar?: string; // Make avatar optional
  };
  publishedAt: string;
  categories?: Array<{ name: string; slug: string }>; // Make categories optional
  tags?: Array<{ name: string; slug: string }>; // Make tags optional
}

interface BlogCardGridProps {
  post: BlogPost;
  index?: number;
  className?: string;
}

const BlogCardGrid: React.FC<BlogCardGridProps> = ({ 
  post, 
  index = 0,
  className 
}) => {
  // Format the date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Animation variants for staggered children
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.1 // Stagger effect
      }
    }
  };

  return (
    <motion.article 
      className={`${styles.card} ${className || ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Link href={`/blog/${post.slug}`} className={styles.imageContainer}>
        <img 
          src={post.featuredImage || '/default-blog-image.jpg'} 
          alt={post.title} 
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-blog-image.jpg'; // Fallback image
          }}
        />
        
        {post.categories && post.categories.length > 0 && (
          <span className={styles.category}>
            {post.categories[0].name}
          </span>
        )}
      </Link>
      
      <div className={styles.content}>
        <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
          <h2 className={styles.title}>{post.title}</h2>
        </Link>
        
        <p className={styles.excerpt}>{post.excerpt || 'No excerpt available'}</p>
        
        <div className={styles.meta}>
          <div className={styles.author}>
            <img 
              src={post.author.avatar || '/default-avatar.png'} 
              alt={post.author.name} 
              className={styles.authorAvatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png'; // Fallback avatar
              }}
            />
            <span className={styles.authorName}>{post.author.name}</span>
          </div>
          
          <div className={styles.dateAndTime}>
            <span className={styles.date}>
              <Calendar size={14} />
              {formattedDate}
            </span>
            <ReadingTimeEstimator content={post.content} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCardGrid;