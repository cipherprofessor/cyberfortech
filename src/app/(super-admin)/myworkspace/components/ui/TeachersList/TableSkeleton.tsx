import React from 'react';
import styles from './TeachersList.module.scss';

const TeachersListSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
        
        <div className={styles.headerControls}>
          <div className={`${styles.skeleton} ${styles.searchSkeleton}`} />
          <div className={`${styles.skeleton} ${styles.paginationSkeleton}`} />
          <div className={`${styles.skeleton} ${styles.buttonSkeleton}`} />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Qualification</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className={styles.row}>
                <td>
                  <div className={styles.teacherInfo}>
                    <div className={`${styles.skeleton} ${styles.avatarSkeleton}`} />
                    <div className={styles.textSkeletons}>
                      <div className={`${styles.skeleton} ${styles.nameSkeleton}`} />
                      <div className={`${styles.skeleton} ${styles.emailSkeleton}`} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className={`${styles.skeleton} ${styles.qualificationSkeleton}`} />
                </td>
                <td>
                  <div className={`${styles.skeleton} ${styles.subjectSkeleton}`} />
                </td>
                <td>
                  <div className={styles.actions}>
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`${styles.skeleton} ${styles.actionSkeleton}`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachersListSkeleton;