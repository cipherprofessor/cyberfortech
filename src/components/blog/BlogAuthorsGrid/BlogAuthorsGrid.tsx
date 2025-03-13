import React from 'react';
import { Users } from 'lucide-react';
import styles from './BlogAuthorsGrid.module.scss';

interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  postCount: number;
}

interface BlogAuthorsGridProps {
  authors: Author[];
  className?: string;
}

const BlogAuthorsGrid: React.FC<BlogAuthorsGridProps> = ({
  authors,
  className
}) => {
  // Sort authors by post count (most active first)
  const sortedAuthors = [...authors].sort((a, b) => b.postCount - a.postCount).slice(0, 6);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <Users size={16} className={styles.icon} />
        <h3 className={styles.title}>Popular Authors</h3>
      </div>
      
      <div className={styles.authorsGrid}>
        {sortedAuthors.map((author) => (
          <div key={author.id} className={styles.authorCard}>
            <div className={styles.avatarContainer}>
              <img 
                src={author.avatar} 
                alt={author.name} 
                className={styles.avatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-avatar.png'; // Fallback avatar
                }}
              />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{author.name}</span>
              <span className={styles.authorRole}>{author.role}</span>
              <span className={styles.postCount}>{author.postCount} posts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAuthorsGrid;