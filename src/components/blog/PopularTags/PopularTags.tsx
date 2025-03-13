import React from 'react';
import { Tag } from 'lucide-react';
import styles from './PopularTags.module.scss';

interface TagItem {
  name: string;
  slug: string;
  count: number;
}

interface PopularTagsProps {
  tags: TagItem[];
  selectedTag: string | null;
  onTagSelect: (tagSlug: string | null) => void;
  className?: string;
}

const PopularTags: React.FC<PopularTagsProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  className
}) => {
  // Sort tags by count (most popular first)
  const sortedTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 15);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <Tag size={16} className={styles.icon} />
        <h3 className={styles.title}>Popular Tags</h3>
      </div>
      
      <div className={styles.tagCloud}>
        {sortedTags.map((tag) => (
          <button
            key={tag.slug}
            className={`${styles.tagButton} ${selectedTag === tag.slug ? styles.active : ''}`}
            onClick={() => onTagSelect(selectedTag === tag.slug ? null : tag.slug)}
          >
            {tag.name} <span className={styles.count}>{tag.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;