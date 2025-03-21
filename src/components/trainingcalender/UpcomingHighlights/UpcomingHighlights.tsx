"use client"
import { motion } from 'framer-motion';
import { Calendar, Clock, Monitor, MapPin, Sparkles, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './UpcomingHighlights.module.scss';
import { TrainingCourseWithEnrollment } from './types';

interface UpcomingHighlightsProps {
  upcomingCourses: TrainingCourseWithEnrollment[];
}

export function UpcomingHighlights({ upcomingCourses }: UpcomingHighlightsProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Function to determine mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Monitor size={16} />;
      case 'in-person':
        return <MapPin size={16} />;
      case 'hybrid':
        return <Monitor size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  // Function to determine course level badge style
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return styles.beginnerBadge;
      case 'intermediate':
        return styles.intermediateBadge;
      case 'advanced':
        return styles.advancedBadge;
      default:
        return '';
    }
  };

  return (
    <motion.div
      className={styles.highlightsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.highlightsHeader}>
        <h3 className={styles.highlightsTitle}>
          <Sparkles size={18} />
          Upcoming Highlights
        </h3>
      </div>

      <div className={styles.highlightsContent}>
        {upcomingCourses.length === 0 ? (
          <div className={styles.noCourses}>
            <p>No upcoming courses at the moment. Check back soon!</p>
          </div>
        ) : (
          upcomingCourses.map((course) => (
            <motion.div
              key={course.id}
              className={styles.courseCard}
              variants={itemVariants}
            >
              <div className={styles.courseHeader}>
                <div className={styles.badgesContainer}>
                  <span className={`${styles.courseBadge} ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </span>
                  {course.enrollmentStatus && (
                    <span className={styles.enrolledBadge}>
                      <CheckCircle size={14} />
                      Enrolled
                    </span>
                  )}
                </div>
                <span className={styles.courseCategory}>{course.category}</span>
              </div>

              <h4 className={styles.courseTitle}>{course.title}</h4>

              <div className={styles.courseDetails}>
                <div className={styles.courseDetail}>
                  <Calendar size={16} />
                  <span>{course.dates}</span>
                </div>

                <div className={styles.courseDetail}>
                  <Clock size={16} />
                  <span>{course.time}</span>
                </div>

                <div className={styles.courseDetail}>
                  {getModeIcon(course.mode)}
                  <span>{course.mode.charAt(0).toUpperCase() + course.mode.slice(1)}</span>
                </div>

                {course.location && (
                  <div className={styles.courseDetail}>
                    <MapPin size={16} />
                    <span>{course.location}</span>
                  </div>
                )}
              </div>

              <div className={styles.instructorInfo}>
                <div className={styles.instructorAvatar}>
                  {course.instructor.charAt(0)}
                </div>
                <span className={styles.instructorName}>
                  Instructor: <strong>{course.instructor}</strong>
                </span>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.priceDisplay}>
                  <span className={styles.priceCurrency}>₹</span>
                  <span className={styles.priceAmount}>{course.price}</span>
                </div>
                <div className={styles.availabilityTag}>
                  {course.availability <= 5 ? (
                    <span className={styles.limitedAvailability}>Limited spots!</span>
                  ) : (
                    <span className={styles.availabilityCount}>{course.availability} seats left</span>
                  )}
                </div>
              </div>

              <a href="#" className={styles.viewDetailsLink}>
                View Course Details
                <ChevronRight size={16} />
              </a>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default UpcomingHighlights;