// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/LoadingState.tsx
import { Loader2 } from 'lucide-react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading enrollments...' }: LoadingStateProps) {
  return (
    <div className={styles.loadingContainer}>
      <Loader2 size={36} className={styles.loadingSpinner} />
      <p>{message}</p>
    </div>
  );
}