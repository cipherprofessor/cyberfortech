// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/Loading/Loading.tsx
import { Book } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Loading.module.scss';

export const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Book className={styles.loadingIcon} />
      </motion.div>
      <p>Loading Course Management Dashboard</p>
    </div>
  );
};