"use client"
import { motion } from 'framer-motion';
import styles from './TrainingCalendarSkeleton.module.scss';

interface TrainingCalendarSkeletonProps {
  rows?: number;
}

export function TrainingCalendarSkeleton({ rows = 3 }: TrainingCalendarSkeletonProps) {
  // Create an array of the specified length for mapping
  const skeletonRows = Array.from({ length: rows }, (_, i) => i);
  
  // Animation variants for skeleton loading effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.skeletonContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.skeletonHeader}>
        <div className={styles.headerColumn}></div>
        <div className={styles.headerColumn}></div>
        <div className={styles.headerColumn}></div>
        <div className={styles.headerColumn}></div>
        <div className={styles.headerColumn}></div>
        <div className={styles.headerColumn}></div>
        <div className={styles.headerColumn}></div>
      </div>

      <div className={styles.skeletonBody}>
        {skeletonRows.map((index) => (
          <motion.div 
            key={index}
            className={styles.skeletonRow}
            variants={rowVariants}
          >
            <div className={styles.skeletonCell}>
              <div className={styles.titleSkeleton}></div>
            </div>
            
            <div className={styles.skeletonCell}>
              <div className={styles.categorySkeleton}></div>
            </div>
            
            <div className={styles.skeletonCell}>
              <div className={styles.levelSkeleton}></div>
            </div>
            
            <div className={styles.skeletonCell}>
              <div className={styles.scheduleSkeleton}>
                <div className={styles.scheduleItemSkeleton}></div>
                <div className={styles.scheduleItemSkeleton}></div>
              </div>
            </div>
            
            <div className={styles.skeletonCell}>
              <div className={styles.availabilitySkeleton}></div>
            </div>
            
            <div className={styles.skeletonCell}>
              <div className={styles.priceSkeleton}></div>
            </div>
            
            <div className={styles.skeletonCell}>
              <div className={styles.actionSkeleton}>
                <div className={styles.buttonSkeleton}></div>
                <div className={styles.iconSkeleton}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Skeleton View */}
      <div className={styles.mobileSkeletonBody}>
        {skeletonRows.map((index) => (
          <motion.div 
            key={`mobile-${index}`}
            className={styles.mobileSkeletonRow}
            variants={rowVariants}
          >
            <div className={styles.mobileSkeletonHeader}>
              <div className={styles.mobileTitleSkeleton}></div>
              <div className={styles.mobileLevelSkeleton}></div>
            </div>
            
            <div className={styles.mobileSkeletonMeta}>
              <div className={styles.mobileCategorySkeleton}></div>
              <div className={styles.mobileScheduleSkeleton}></div>
              <div className={styles.mobileScheduleSkeleton}></div>
            </div>
            
            <div className={styles.mobileSkeletonDetails}>
              <div className={styles.mobileAvailabilitySkeleton}></div>
              <div className={styles.mobilePriceSkeleton}></div>
            </div>
            
            <div className={styles.mobileSkeletonActions}>
              <div className={styles.mobileButtonSkeleton}></div>
              <div className={styles.mobileIconSkeleton}></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default TrainingCalendarSkeleton;