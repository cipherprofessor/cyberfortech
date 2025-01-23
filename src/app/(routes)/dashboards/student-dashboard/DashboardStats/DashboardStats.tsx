import { Book, Award, Target, Clock } from 'lucide-react';
import styles from './DashboardStats.module.scss';

type DashboardStatsProps = {
  stats: {
    coursesEnrolled: number;
    coursesCompleted: number;
    averageScore: number;
    totalHours: number;
  };
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      icon: Book,
      label: 'Courses Enrolled',
      value: stats.coursesEnrolled,
      color: '#007bff',
    },
    {
      icon: Award,
      label: 'Courses Completed',
      value: stats.coursesCompleted,
      color: '#28a745',
    },
    {
      icon: Target,
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      color: '#ffc107',
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: stats.totalHours,
      color: '#17a2b8',
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {statItems.map((item) => (
        <div key={item.label} className={styles.statCard}>
          <div 
            className={styles.iconContainer}
            style={{ backgroundColor: `${item.color}15` }}
          >
            <item.icon style={{ color: item.color }} className={styles.icon} />
          </div>
          
          <div className={styles.content}>
            <span className={styles.value}>{item.value}</span>
            <span className={styles.label}>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}