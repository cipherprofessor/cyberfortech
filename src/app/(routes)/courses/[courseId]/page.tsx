// src/app/(routes)/courses/[courseId]/page.tsx
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

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/${params.courseId}`);
      setCourse(response.data);
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
  }, [params.courseId]);

  if (loading) {
    return (
      <motion.div 
        className={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
          Retry
        </motion.button>
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
        <CourseHeader course={course} />
        
        <div className={styles.courseContent}>
          <motion.main 
            className={styles.mainContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CourseContent course={course} />
          </motion.main>
          
          <motion.aside 
            className={styles.sidebar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CourseSidebar course={course} />
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}