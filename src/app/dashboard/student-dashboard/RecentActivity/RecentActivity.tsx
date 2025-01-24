import { CheckCircle, Award, FileText, PlayCircle } from 'lucide-react';
import styles from './RecentActivity.module.scss';

type Activity = {
  id: number;
  type: 'completion' | 'quiz' | 'assignment' | 'video';
  title: string;
  timestamp: string;
};

type RecentActivityProps = {
  activities: Activity[];
};

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'completion':
        return CheckCircle;
      case 'quiz':
        return Award;
      case 'assignment':
        return FileText;
      case 'video':
        return PlayCircle;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Convert diff to minutes
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    
    // Convert to hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    
    // Convert to days
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} days ago`;
    }
    
    // Return formatted date for older activities
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={styles.activityContainer}>
      <div className={styles.header}>
        <h2>Recent Activity</h2>
        <button className={styles.viewAllButton}>
          View All
        </button>
      </div>

      <div className={styles.timeline}>
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className={styles.activityItem}>
              <div 
                className={`${styles.iconContainer} ${styles[activity.type]}`}
              >
                <Icon className={styles.icon} />
              </div>

              <div className={styles.activityContent}>
                <p className={styles.activityTitle}>{activity.title}</p>
                <time className={styles.timestamp}>
                  {formatTimestamp(activity.timestamp)}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}