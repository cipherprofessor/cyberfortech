"use client"
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Clock, Users } from 'lucide-react';
import styles from './TrainingHeader.module.scss';

interface TrainingHeaderProps {
  totalCourses: number;
  availableCourses: number;
}

export function TrainingHeader({
  totalCourses,
  availableCourses
}: TrainingHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <motion.div 
        className={styles.headerContent}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerInfo}>
          <div className={styles.headerTitle}>
            <h1 className={styles.mainTitle}>Training Calendar</h1>
            <p className={styles.subTitle}>
              Showing {availableCourses} out of {totalCourses} courses available
            </p>
          </div>
          
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <GraduationCap size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{totalCourses}</span>
                <span className={styles.statLabel}>Total Courses</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Calendar size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Upcoming</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Clock size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>45+</span>
                <span className={styles.statLabel}>Training Hours</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Users size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>500+</span>
                <span className={styles.statLabel}>Enrollments</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.actionButtons}>
            <button className={styles.primaryButton}>
              Download Schedule
            </button>
            <button className={styles.secondaryButton}>
              Request Course
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TrainingHeader;