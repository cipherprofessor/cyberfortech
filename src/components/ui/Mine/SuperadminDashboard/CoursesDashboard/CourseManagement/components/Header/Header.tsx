// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/Header/Header.tsx
import { Book, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Header.module.scss';

interface HeaderProps {
  onCreateCourse: () => void;
}

export const Header = ({ onCreateCourse }: HeaderProps) => {
  return (
    <motion.div 
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.titleSection}>
        <Book className={styles.titleIcon} />
        <div>
          <h1>Course Management</h1>
          <p>Manage and organize all courses in the system</p>
        </div>
      </div>

      <motion.button
        className={styles.createButton}
        onClick={onCreateCourse}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={20} />
        <span>Create Course</span>
      </motion.button>
    </motion.div>
  );
};