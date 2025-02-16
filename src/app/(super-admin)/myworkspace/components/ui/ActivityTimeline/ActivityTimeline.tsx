// ActivityTimeline.tsx
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import styles from './ActivityTimeline.module.scss';
import { Activity } from './types';

interface ActivityTimelineProps {
  activities: Activity[];
  onViewAll?: () => void;
  className?: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  activities,
  onViewAll,
  className = ''
}) => {
  const { theme } = useTheme();
  const containerClass = `${styles.container} ${theme === 'dark' ? styles.dark : ''} ${className}`;

  return (
    <motion.div 
      className={containerClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
        <button 
          onClick={onViewAll}
          className={styles.viewAll}
        >
          View All
        </button>
      </div>

      <div className={styles.timeline}>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className={styles.activityItem}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.timestamp}>{activity.timestamp}</div>
            
            <div className={styles.indicator}>
              <div 
                className={styles.dot}
                style={{ 
                  '--dot-color': activity.color 
                } as React.CSSProperties}
              />
              {index !== activities.length - 1 && (
                <div className={styles.line} />
              )}
            </div>

            <div className={styles.content}>
              <div className={styles.user}>{activity.user.name}</div>
              <div className={styles.details}>
                <span className={styles.action}>
                  {activity.details.action}{' '}
                </span>
                <span 
                  className={styles.target}
                  style={{ color: activity.color }}
                >
                  {activity.details.target}
                </span>
                {activity.details.additionalInfo && (
                  <>
                    {' '}
                    <span className={styles.action}>with username </span>
                    <span 
                      className={styles.target}
                      style={{ color: activity.color }}
                    >
                      {activity.details.additionalInfo}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;