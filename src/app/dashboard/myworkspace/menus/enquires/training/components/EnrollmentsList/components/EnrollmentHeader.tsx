// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/EnrollmentHeader.tsx
import { Filter } from 'lucide-react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';

interface EnrollmentHeaderProps {
  selectedCourseId: string | null;
  onToggleFilter: () => void;
}

export function EnrollmentHeader({ selectedCourseId, onToggleFilter }: EnrollmentHeaderProps) {
  return (
    <div className={styles.enrollmentsHeader}>
      <div>
        <h2>Course Enrollments</h2>
        <p>View and manage student enrollments</p>
      </div>
      
      <button className={styles.filterButton} onClick={onToggleFilter}>
        <Filter size={16} />
        {selectedCourseId ? 'Change Course' : 'Filter by Course'}
      </button>
    </div>
  );
}