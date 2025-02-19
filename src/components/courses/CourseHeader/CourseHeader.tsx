// src/components/courses/CourseHeader/CourseHeader.tsx
'use client';
//Alpha Centauri
import { motion } from 'framer-motion';
import { Star, Users, Clock, Award } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './CourseHeader.module.scss';
import { Course } from '@/types/courses';

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${styles.header} ${isDark ? styles.dark : ''}`}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={styles.breadcrumbs}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span>Courses</span>
          <span className={styles.separator}>/</span>
          <span>{course.category}</span>
        </motion.div>

        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>

        {course.instructor_name && (
          <div className={styles.instructorInfo}>
            <motion.img 
              src={course.instructor_profile_image_url || "/api/placeholder/48/48"} 
              alt={course.instructor_name}
              className={styles.avatar}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className={styles.instructorDetails}>
              <span className={styles.instructorLabel}>Instructor</span>
              <span className={styles.instructorName}>{course.instructor_name}</span>
            </div>
          </div>
        )}

        <motion.div 
          className={styles.stats}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {course.average_rating > 0 && (
            <motion.div 
              className={styles.statItem}
              whileHover={{ scale: 1.05 }}
            >
              <Star className={styles.icon} size={20} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {course.average_rating.toFixed(1)}
                </span>
                <span className={styles.statLabel}>
                  ({course.total_reviews} reviews)
                </span>
              </div>
            </motion.div>
          )}

          {course.total_students > 0 && (
            <motion.div 
              className={styles.statItem}
              whileHover={{ scale: 1.05 }}
            >
              <Users className={styles.icon} size={20} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {course.total_students.toLocaleString()}
                </span>
                <span className={styles.statLabel}>students</span>
              </div>
            </motion.div>
          )}

          {course.duration && (
            <motion.div 
              className={styles.statItem}
              whileHover={{ scale: 1.05 }}
            >
              <Clock className={styles.icon} size={20} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{course.duration}</span>
                <span className={styles.statLabel}>duration</span>
              </div>
            </motion.div>
          )}

          {course.level && (
            <motion.div 
              className={styles.statItem}
              whileHover={{ scale: 1.05 }}
            >
              <Award className={styles.icon} size={20} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{course.level}</span>
                <span className={styles.statLabel}>level</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}