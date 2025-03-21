// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/EnrollmentTable.tsx
import { motion } from 'framer-motion';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';
import { Enrollment } from '../types';
import { EnrollmentRow } from './EnrollmentRow';

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  onViewEnrollment: (enrollment: Enrollment) => void;
  onEditEnrollment: (enrollment: Enrollment) => void;
}

export function EnrollmentTable({ 
  enrollments, 
  onViewEnrollment, 
  onEditEnrollment 
}: EnrollmentTableProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div 
      className={styles.enrollmentsTable}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Student</div>
        <div className={styles.headerCell}>Course</div>
        <div className={styles.headerCell}>Enrollment Date</div>
        <div className={styles.headerCell}>Status</div>
        <div className={styles.headerCell}>Payment</div>
        <div className={styles.headerCell}>Actions</div>
      </div>
      
      <div className={styles.tableBody}>
        {enrollments.map((enrollment) => (
          <EnrollmentRow 
            key={enrollment.id}
            enrollment={enrollment}
            onView={onViewEnrollment}
            onEdit={onEditEnrollment}
          />
        ))}
      </div>
    </motion.div>
  );
}