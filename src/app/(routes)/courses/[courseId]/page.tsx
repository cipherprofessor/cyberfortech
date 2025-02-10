'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CourseContent } from '@/components/courses/CourseContent/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader/CourseHeader';
import { CourseSidebar } from '@/components/courses/CourseSidebar/CourseSidebar';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import styles from './course-detail.module.scss';

interface CourseSection {
  id: string;
  title: string;
  lessons: Array<{
    id: string;
    title: string;
    duration: string;
    order_index: number;
  }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  instructor_avatar: string;
  price: number;
  duration: string;
  level: string;
  average_rating: number;
  total_students: number;
  total_reviews: number;
  sections: CourseSection[];
}

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${params.courseId}`);
        setCourse(response.data);
      } catch (err) {
        setError('Failed to load course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} />
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error || 'Failed to load course'}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${styles.courseContainer} ${isDark ? styles.dark : ''}`}
    >
      <CourseHeader course={course} />
      
      <div className={styles.courseContent}>
        <motion.main 
          className={styles.mainContent}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CourseContent course={course} />
        </motion.main>
        
        <motion.aside 
          className={styles.sidebar}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CourseSidebar course={course} />
        </motion.aside>
      </div>
    </motion.div>
  );
}