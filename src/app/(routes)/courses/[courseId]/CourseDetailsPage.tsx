'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CourseContent } from '@/components/courses/CourseContent/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader/CourseHeader';
import { CourseSidebar } from '@/components/courses/CourseSidebar/CourseSidebar';
import { useTheme } from 'next-themes';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './course-detail.module.scss';
import { CourseDataProvider, useCourseData } from '@/contexts/CourseDataProvider';


interface CourseDetailClientProps {
  courseId: string;
}

// Main component wrapper with context provider
export function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  return (
    <CourseDataProvider courseId={courseId}>
      <CourseDetailContent />
    </CourseDataProvider>
  );
}

// Inner component that consumes the context
function CourseDetailContent() {
  const { 
    courseBasic, 
    courseContent, 
    isLoadingBasic, 
    isLoadingContent, 
    errorBasic, 
    errorContent,
    refetchBasic, 
    refetchContent 
  } = useCourseData();
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Show loading state if either basic info or content is loading
  if (isLoadingBasic || isLoadingContent) {
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

  // Show error state if either basic info or content has an error
  if ((errorBasic || !courseBasic) || (errorContent || !courseContent)) {
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
          <p>{errorBasic || errorContent || 'Failed to load course'}</p>
          <motion.button
            className={styles.retryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              refetchBasic();
              refetchContent();
            }}
            aria-label="Retry loading course"
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>Retry</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Extract sections from courseContent if available
  const sections = courseContent?.sections || [];

  // Create a complete course data object with defaults for required fields
  const courseData = {
    id: courseBasic.id,
    title: courseBasic.title || '',
    description: courseBasic.description || '',
    price: courseBasic.price || 0,
    duration: courseBasic.duration || courseContent?.courseContent?.estimated_completion_time || 'Not specified',
    level: courseBasic.level || courseContent?.courseContent?.level || 'Beginner',
    category: courseBasic.category || '',
    instructor_id: courseBasic.instructor_id || '',
    instructor_name: courseBasic.instructor_name || courseContent?.courseContent?.instructor_name || '',
    instructor_profile_image_url: courseBasic.instructor_profile_image_url || '',
    instructor_avatar: courseBasic.instructor_profile_image_url || '', // Added for backward compatibility
    image_url: courseBasic.image_url || courseContent?.courseContent?.image_url || '',
    total_students: courseBasic.total_students || 0,
    total_reviews: courseBasic.total_reviews || 0,
    average_rating: courseBasic.average_rating || 0,
    updated_at: courseBasic.updated_at || '',
    created_at: courseBasic.created_at || '',
    sections: sections // Added for backward compatibility
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
              <CourseContent 
                courseId={courseBasic.id} 
                courseContentData={courseContent} 
              />
            </motion.main>
          </div>
          
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.sidebarColumn}
          >
            <CourseSidebar 
              course={courseData} 
              courseContent={courseContent}
            />
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}