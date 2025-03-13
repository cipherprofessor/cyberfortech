import React from 'react';
import { List, Grid } from 'lucide-react';
import styles from './BlogViewOptions.module.scss';

type ViewMode = 'list' | 'grid';

interface BlogViewOptionsProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

const BlogViewOptions: React.FC<BlogViewOptionsProps> = ({
  currentView,
  onViewChange,
  className
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <button
        className={`${styles.viewButton} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
        title="List view"
      >
        <List size={18} />
      </button>
      
      <button
        className={`${styles.viewButton} ${currentView === 'grid' ? styles.active : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        title="Grid view"
      >
        <Grid size={18} />
      </button>
    </div>
  );
};

export default BlogViewOptions;