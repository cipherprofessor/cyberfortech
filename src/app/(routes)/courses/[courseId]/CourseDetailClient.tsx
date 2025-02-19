'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { CourseContent } from '@/components/courses/CourseContent/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader/CourseHeader';
import { CourseSidebar } from '@/components/courses/CourseSidebar/CourseSidebar';
import { useTheme } from 'next-themes';
import { 
  Loader2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import styles from './course-detail.module.scss';
import { Course } from '@/types/courses';

interface CourseDetailClientProps {
  courseId: string;
}

export function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchCourse = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const { data } = await axios.get<Course>(`/api/courses/${courseId}`);
      setCourse(data);
      setError(null);
    } catch (err) {
      setError('Failed to load course details');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <motion.div 
        className={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.loadingContent}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 
              className={styles.loadingSpinner}
              aria-label="Loading course details" 
            />
          </motion.div>
          <p>Loading course details...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !course) {
    return (
      <motion.div 
        className={styles.errorContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.errorContent}>
          <AlertTriangle 
            size={48} 
            className={styles.errorIcon}
            aria-label="Error icon" 
          />
          <h2>Error Loading Course</h2>
          <p>{error || 'Failed to load course'}</p>
          <motion.button
            className={styles.retryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCourse}
            aria-label="Retry loading course"
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>Retry</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${styles.courseContainer} ${isDark ? styles.dark : ''}`}
      >
        <div className={styles.header}>
          <motion.div 
            className={styles.courseHeader}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Course Deatils Page header */}
            <CourseHeader course={course} />
          </motion.div>
        </div>
        
        <div className={styles.courseContent}>
          <motion.main 
            className={styles.mainContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CourseContent course={{ ...course, duration: course?.duration || '', level: course?.level || 'Beginner' }} />
          </motion.main>
          
          <motion.aside 
            className={styles.sidebar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CourseSidebar course={{ ...course, duration: course?.duration || '', level: course?.level || 'Beginner' }} />
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}