import React from 'react';
import { BarChart2, BookOpen, Users, Calendar } from 'lucide-react';
import styles from './BlogStats.module.scss';

interface BlogStatsProps {
  totalPosts: number;
  totalAuthors: number;
  totalCategories: number;
  lastUpdated: Date | string;
  className?: string;
}

const BlogStats: React.FC<BlogStatsProps> = ({
  totalPosts,
  totalAuthors,
  totalCategories,
  lastUpdated,
  className
}) => {
  // Format the date
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h3 className={styles.title}>Blog Statistics</h3>
      
      <div className={styles.statsList}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <BookOpen size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalPosts}</span>
            <span className={styles.statLabel}>Articles</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Users size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalAuthors}</span>
            <span className={styles.statLabel}>Authors</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <BarChart2 size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalCategories}</span>
            <span className={styles.statLabel}>Categories</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Calendar size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formattedDate}</span>
            <span className={styles.statLabel}>Last Updated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStats;