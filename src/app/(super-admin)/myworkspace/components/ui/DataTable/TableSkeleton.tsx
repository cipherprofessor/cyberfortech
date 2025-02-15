import React from 'react';
import styles from './TableSkeleton.module.scss';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 7
}) => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton} />
        <div className={styles.controlsSkeleton}>
          <div className={styles.searchSkeleton} />
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className={styles.headerCell} />
          ))}
        </div>

        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.tableRow}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className={`${styles.tableCell} ${
                  colIndex === 0 ? styles.customerCell : ''
                }`} 
              >
                {colIndex === 0 && (
                  <>
                    <div className={styles.avatar} />
                    <div className={styles.customerInfo}>
                      <div className={styles.nameSkeleton} />
                      <div className={styles.emailSkeleton} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;