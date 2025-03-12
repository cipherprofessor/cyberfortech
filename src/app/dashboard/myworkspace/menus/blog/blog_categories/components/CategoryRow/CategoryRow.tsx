// src/app/dashboard/myworkspace/menus/blog/blog_categories/components/CategoryRow.tsx
import React from 'react';
import { FilePlus } from 'lucide-react';

import styles from './CategoryRow.module.scss';
import { CategoryWithCount } from '../../types';

interface CategoryRowProps {
  category: CategoryWithCount;
}

 const CategoryRow: React.FC<CategoryRowProps> = ({ category }) => {
  // Check if a string is an emoji
  const isEmoji = (str: string | null | undefined): boolean => {
    if (!str) return false;
    return /\p{Emoji}/u.test(str) || str.length < 5;
  };

  // Get icon element based on type
  const getIcon = () => {
    if (!category.imageUrl) {
      return (
        <div className={styles.iconPlaceholder}>
          <FilePlus size={16} />
        </div>
      );
    }
    
    if (isEmoji(category.imageUrl)) {
      return <span className={styles.emojiIcon}>{category.imageUrl}</span>;
    }
    
    return (
      <div className={styles.iconContainer}>
        <img 
          src={category.imageUrl} 
          alt=""
          className={styles.imageIcon}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/24/24';
          }}
        />
      </div>
    );
  };

  return (
    <div className={styles.categoryRow}>
      {getIcon()}
      <span className={styles.categoryName}>
        {category.parentId && <span className={styles.childIndicator}>↳</span>}
        {category.name}
      </span>
    </div>
  );
};