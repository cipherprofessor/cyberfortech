// src/components/blog/FeaturedPosts/index.tsx
import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { BlogPost } from '@/types/blog';
import styles from './FeaturedPosts.module.scss';

interface FeaturedPostsProps {
  posts: BlogPost[];
  className?: string;
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  className,
}) => {
  const { theme } = useTheme();
  
  // Format date function
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    } catch (error) {
      return '';
    }
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className={clsx(
      styles.container,
      theme === 'dark' && styles.dark,
      className
    )}>
      <h3 className={styles.sectionHeading}>FEATURED POSTS</h3>
      
      {posts.map(post => {
        // Get the primary category if available
        const primaryCategory = post.categories && post.categories.length > 0 
          ? post.categories[0] 
          : null;
          
        return (
          <div key={post.id} className={styles.featuredPost}>
            <div className={styles.featuredImage}>
              <img 
                src={post.featuredImage || '/api/placeholder/300/200'} 
                alt={post.title} 
                className={styles.featuredPostImage} 
              />
              {primaryCategory && (
                <span className={styles.featuredLabel}>
                  {primaryCategory.name.toUpperCase()}
                </span>
              )}
            </div>
            <h4 className={styles.featuredTitle}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h4>
            <div className={styles.featuredMeta}>
              <span className={styles.featuredAuthor}>{post.author.fullName}</span>
              <span className={styles.featuredDate}>
                on {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedPosts;