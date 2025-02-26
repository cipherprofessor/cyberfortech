'use client';

import { motion } from 'framer-motion';
import { Star, Users, Clock, Award, BookOpen, Tag, Calendar, BarChart2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import styles from './CourseHeader.module.scss';
import { Course } from '@/types/courses';

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const debugLoggedRef = useRef(false);

  // Debug the instructor image only once to avoid loops
  useEffect(() => {
    if (debugLoggedRef.current) return;
    
    debugLoggedRef.current = true;
    console.log('Course data:', course);
    
    if (course?.instructor_profile_image_url) {
      console.log('Instructor image URL:', course.instructor_profile_image_url);
    } else {
      console.log('No instructor image URL found in course data');
    }
  }, [course]);

  // Format the date if it exists
  const formattedDate = course.created_at 
    ? new Date(course.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Get the rating value safely for display and calculations
  const rating = typeof course.average_rating === 'number' ? course.average_rating : 0;
  const ratingFloor = Math.floor(rating);

  // Ratings animation variants
  const ratingVariants = {
    initial: { width: 0 },
    animate: (rating: number) => ({
      width: `${(rating / 5) * 100}%`,
      transition: { duration: 1, ease: "easeOut" }
    })
  };

  // Stats item animation variants
  const statsItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.1 * custom,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Header elements animation variants
  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`${styles.header} ${isDark ? styles.dark : ''}`}>
      <motion.div 
        className={styles.content}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className={styles.breadcrumbs}
          variants={itemVariants}
        >
          <span>Courses</span>
          <span className={styles.separator}>/</span>
          <span>{course.category || 'All Categories'}</span>
          {course.level && (
            <>
              <span className={styles.separator}>/</span>
              <span>{course.level}</span>
            </>
          )}
        </motion.div>

        <motion.h1 
          className={styles.title}
          variants={itemVariants}
        >
          {course.title}
        </motion.h1>
        
        <motion.div 
          className={styles.headlineWrapper}
          variants={itemVariants}
        >
          {rating > 0 && (
            <div className={styles.ratingContainer}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={18} 
                    className={`${styles.star} ${star <= ratingFloor ? styles.filled : ''}`} 
                  />
                ))}
                <motion.div 
                  className={styles.ratingFill}
                  variants={ratingVariants}
                  initial="initial"
                  animate="animate"
                  custom={rating}
                />
              </div>
              <span className={styles.ratingValue}>
                {rating.toFixed(1)}
              </span>
              <span className={styles.ratingCount}>
                ({course.total_reviews || 0} reviews)
              </span>
            </div>
          )}
          
          {typeof course.total_students === 'number' && course.total_students > 0 && (
            <div className={styles.enrollmentBadge}>
              <Users size={14} />
              <span>{course.total_students.toLocaleString()} students enrolled</span>
            </div>
          )}
          
          {formattedDate && (
            <div className={styles.dateBadge}>
              <Calendar size={14} />
              <span>Updated: {formattedDate}</span>
            </div>
          )}
        </motion.div>
        
        <motion.p 
          className={styles.description}
          variants={itemVariants}
        >
          {course.description}
        </motion.p>

        {course.instructor_name && (
  <motion.div 
    className={styles.instructorInfo}
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
  >
    <div className={styles.avatarContainer}>
      <motion.div 
        className={styles.avatarWrapper}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {course.instructor_profile_image_url ? (
          <img
            src={course.instructor_profile_image_url}
            alt={course.instructor_name}
            className={styles.avatarImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
            }}
          />
        ) : null}
        <div className={`${styles.avatarInitials} ${course.instructor_profile_image_url ? styles.hidden : ''}`}>
          {course.instructor_name.split(' ').map(name => name[0]).join('')}
        </div>
      </motion.div>
      <motion.div 
        className={styles.avatarBadge}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <BookOpen size={12} />
      </motion.div>
    </div>
    <div className={styles.instructorDetails}>
      <span className={styles.instructorLabel}>Instructor</span>
      <span className={styles.instructorName}>{course.instructor_name}</span>
      <div className={styles.instructorMeta}>
        <span>Professional Educator</span>
        <span className={styles.dot}>&middot;</span>
        <span>Course Creator</span>
      </div>
    </div>
  </motion.div>
)}

        <motion.div 
          className={styles.stats}
          variants={itemVariants}
        >
          <motion.div 
            className={styles.statItem}
            variants={statsItemVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`${styles.iconWrapper} ${styles.iconLevel}`}>
              <Award size={22} className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{course.level || 'Beginner'}</span>
              <span className={styles.statLabel}>Difficulty Level</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.statItem}
            variants={statsItemVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`${styles.iconWrapper} ${styles.iconDuration}`}>
              <Clock size={22} className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{course.duration || 'Self-paced'}</span>
              <span className={styles.statLabel}>Course Duration</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.statItem}
            variants={statsItemVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`${styles.iconWrapper} ${styles.iconCategory}`}>
              <Tag size={22} className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{course.category || 'General'}</span>
              <span className={styles.statLabel}>Category</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.statItem}
            variants={statsItemVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`${styles.iconWrapper} ${styles.iconStudents}`}>
              <BarChart2 size={22} className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {typeof course.total_students === 'number' 
                  ? course.total_students > 1000 
                    ? `${(course.total_students / 1000).toFixed(1)}K` 
                    : course.total_students.toString()
                  : '0'}
              </span>
              <span className={styles.statLabel}>Active Students</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}