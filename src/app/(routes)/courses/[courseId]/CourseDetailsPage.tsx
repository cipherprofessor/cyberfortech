// src/app/(routes)/courses/[courseId]/CourseDetailsPage.tsx
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

  // Move fetchCourse inside the component
  const fetchCourse = async () => {
    if (!courseId) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

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
            onClick={() => fetchCourse()}
            aria-label="Retry loading course"
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>Retry</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Create a courseData object with all required fields having defaults
  const courseData: Course = {
    id: course.id,
    title: course.title || '',
    description: course.description || '',
    price: course.price || 0,
    duration: course.duration || 'Not specified',
    level: course.level || 'Beginner',
    category: course.category || '',
    instructor_id: course.instructor_id || '',
    instructor_name: course.instructor_name || '',
    image_url: course.image_url || '',
    total_students: course.total_students || 0,
    total_reviews: course.total_reviews || 0,
    average_rating: course.average_rating || 0
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${styles.courseContainer} ${isDark ? styles.dark : ''}`}
      >
        <div className={styles.courseContent}>
          <div className={styles.mainContentColumn}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.header}
            >
              <CourseHeader course={courseData} />
            </motion.div>
            
            <motion.main 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.mainContent}
            >
              <CourseContent courseId={courseId} />
            </motion.main>
          </div>
          
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.sidebarColumn}
          >
            <CourseSidebar course={courseData} />
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}