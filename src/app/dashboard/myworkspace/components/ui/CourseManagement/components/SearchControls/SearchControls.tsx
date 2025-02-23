// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/SearchControls/SearchControls.tsx
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './SearchControls.module.scss';

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchControls = ({ searchTerm, onSearchChange }: SearchControlsProps) => {
  return (
    <motion.div 
      className={styles.controls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className={styles.searchBar}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
};