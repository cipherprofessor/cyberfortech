import React from 'react';
import { Clock } from 'lucide-react';
import styles from './ReadingTimeEstimator.module.scss';

interface ReadingTimeEstimatorProps {
  content: string | undefined;
  minLength?: number; // Minimum reading time in minutes
  wpm?: number; // words per minute
  className?: string;
}

const ReadingTimeEstimator: React.FC<ReadingTimeEstimatorProps> = ({
  content = '',
  minLength = 1, // Minimum reading time to show
  wpm = 225, // More realistic average adult reading speed
  className
}) => {
  const calculateReadingTime = () => {
    if (!content) return `${minLength} min read`;
    
    // Count words in content - handle content with lots of code or special characters better
    const text = content.replace(/[^\w\s]/g, ''); // Remove special characters
    const words = text.trim().split(/\s+/).length;
    
    // For longer content, reduce the effective reading speed (people slow down)
    let effectiveWpm = wpm;
    if (words > 2000) effectiveWpm = wpm * 0.9;
    if (words > 5000) effectiveWpm = wpm * 0.8;
    
    // Calculate reading time in minutes
    const minutes = Math.max(minLength, Math.ceil(words / effectiveWpm));
    
    // Format the output
    if (minutes < 1) return '< 1 min read';
    if (minutes === 1) return '1 min read';
    if (minutes < 60) return `${minutes} min read`;
    
    // Handle very long content (1 hour+)
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) return `${hours} hr read`;
    return `${hours} hr ${remainingMinutes} min read`;
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Clock size={14} className={styles.icon} />
      <span className={styles.time}>{calculateReadingTime()}</span>
    </div>
  );
};

export default ReadingTimeEstimator;