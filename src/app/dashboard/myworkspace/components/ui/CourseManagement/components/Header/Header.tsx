'use client';

import { Book, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Header.module.scss';

interface HeaderProps {
  onCreateCourse: () => void;
}

export const Header = ({ onCreateCourse }: HeaderProps) => {
  const handleCreateCourseClick = (e: React.MouseEvent) => {
    // Prevent any default behaviors
    e.preventDefault();
    e.stopPropagation();
    
    // Call the provided callback
    onCreateCourse();
    
    // Log to help with debugging
    console.log('Create Course button clicked');
  };

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
        onClick={handleCreateCourseClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
      >
        <Plus size={20} />
        <span>Create Course</span>
      </motion.button>
    </motion.div>
  );
};