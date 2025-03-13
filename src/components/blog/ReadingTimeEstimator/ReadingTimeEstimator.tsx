import React from 'react';
import { Clock } from 'lucide-react';
import styles from './ReadingTimeEstimator.module.scss';

interface ReadingTimeEstimatorProps {
  content: string | undefined; // Make content optional
  wpm?: number; // words per minute
  className?: string;
}

const ReadingTimeEstimator: React.FC<ReadingTimeEstimatorProps> = ({
  content = '', // Provide a default empty string
  wpm = 200, // Average adult reading speed
  className
}) => {
  const calculateReadingTime = () => {
    if (!content) return '< 1 min read';
    
    // Count words in content
    const words = content.trim().split(/\s+/).length;
    
    // Calculate reading time in minutes
    const minutes = Math.ceil(words / wpm);
    
    return minutes < 1 ? '< 1 min read' : `${minutes} min read`;
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Clock size={14} className={styles.icon} />
      <span className={styles.time}>{calculateReadingTime()}</span>
    </div>
  );
};

export default ReadingTimeEstimator;