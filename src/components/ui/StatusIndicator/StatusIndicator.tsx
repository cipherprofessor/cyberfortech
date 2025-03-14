'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './StatusIndicator.module.scss';

export interface StatusIndicatorProps {
  showDuringLoad?: boolean;
}

/**
 * A global status indicator that displays
 * loading state for Redux async actions
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  showDuringLoad = true 
}) => {
  const { theme } = useTheme();
  const pathname = usePathname();
  
  // Get all loading states from Redux
  const loadingStates = useSelector((state: RootState) => {
    // Check if blog slice exists (it might not on some pages)
    if (!state.blog) return {};
    
    return state.blog.loading;
  });
  
  // Check if any loading state is active
  const isLoading = Object.values(loadingStates).some(Boolean);
  
  // Only show if we're actively loading something
  if (!isLoading || !showDuringLoad) {
    return null;
  }
  
  return (
    <motion.div 
      className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className={styles.indicator}>
        <div className={styles.spinner} />
        <span className={styles.text}>Loading...</span>
      </div>
    </motion.div>
  );
};

export default StatusIndicator;