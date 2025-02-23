// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/EmptyState/EmptyState.tsx
import { AlertTriangle } from 'lucide-react';
import styles from './EmptyState.module.scss';

export const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <AlertTriangle size={48} />
      <h3>No courses found</h3>
      <p>Try adjusting your search or create a new course</p>
    </div>
  );
};