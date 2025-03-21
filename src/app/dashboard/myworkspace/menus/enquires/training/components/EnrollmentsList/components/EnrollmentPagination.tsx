// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/EnrollmentPagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';
import { PaginationInfo } from '../types';

interface EnrollmentPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function EnrollmentPagination({ 
  pagination, 
  onPageChange 
}: EnrollmentPaginationProps) {
  if (pagination.totalPages <= 1) return null;
  
  return (
    <div className={styles.pagination}>
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      
      <span className={styles.paginationInfo}>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
