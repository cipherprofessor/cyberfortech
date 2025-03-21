// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/ErrorState.tsx
import { AlertCircle } from 'lucide-react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.errorContainer}>
      <AlertCircle size={36} className={styles.errorIcon} />
      <p>{message}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}