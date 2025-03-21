// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/EmptyState.tsx
import { Users } from 'lucide-react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';

interface EmptyStateProps {
  courseId?: string | null;
  onReset?: () => void;
}

export function EmptyState({ courseId, onReset }: EmptyStateProps) {
  return (
    <div className={styles.emptyContainer}>
      <Users size={48} className={styles.emptyIcon} />
      <h3>No Enrollments Found</h3>
      <p>There are no enrollments{courseId ? ' for this course' : ''} yet.</p>
      {courseId && onReset && (
        <button className={styles.changeButton} onClick={onReset}>
          View All Enrollments
        </button>
      )}
    </div>
  );
}