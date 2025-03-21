"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Users, Monitor, Briefcase, MapPin, Clock, CalendarClock, Zap, Tag, Lock, CheckCircle } from 'lucide-react';
import styles from './TrainingCalendarTable.module.scss';
import TrainingCalendarSkeleton from './TrainingCalendarSkeleton/TrainingCalendarSkeleton';

// Interface for training course data
interface TrainingCourse {
  id: string;
  title: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor: string;
  availability: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  prerequisites?: string[];
  certification?: string;
  language: string;
  enrollmentStatus?: string; // Added to track user's enrollment status
}

interface TrainingCalendarTableProps {
  courses: TrainingCourse[];
  isLoading: boolean;
  onEnroll: (course: TrainingCourse) => void;
  isAuthenticated: boolean;
}

export function TrainingCalendarTable({ 
  courses, 
  isLoading, 
  onEnroll,
  isAuthenticated
}: TrainingCalendarTableProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const handleToggleExpand = (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
    }
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Function to determine availability status style
  const getAvailabilityStatus = (availability: number) => {
    if (availability <= 5) return styles.lowAvailability;
    if (availability <= 15) return styles.mediumAvailability;
    return styles.highAvailability;
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

  // Function to get appropriate icon for course mode
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Monitor size={16} />;
      case 'in-person':
        return <Briefcase size={16} />;
      case 'hybrid':
        return <Zap size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  // Function to render the appropriate enrollment button based on status
  const renderEnrollButton = (course: TrainingCourse) => {
    // If user is already enrolled
    if (course.enrollmentStatus) {
      return (
        <button 
          className={`${styles.enrollButton} ${styles.enrolledButton}`}
          disabled
        >
          <CheckCircle size={16} />
          Already Enrolled
        </button>
      );
    }
    
    // If user is not authenticated
    if (!isAuthenticated) {
      return (
        <button 
          className={`${styles.enrollButton} ${styles.loginButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onEnroll(course);
          }}
        >
          <Lock size={16} />
          Login to Enroll
        </button>
      );
    }
    
    // Default case - user is authenticated but not enrolled
    return (
      <button 
        className={styles.enrollButton}
        onClick={(e) => {
          e.stopPropagation();
          onEnroll(course);
        }}
      >
        Enroll Now
      </button>
    );
  };

  if (isLoading) {
    return (
        <TrainingCalendarSkeleton rows={7} />
    );
  }

  if (courses.length === 0) {
    return (
      <div className={styles.noCoursesContainer}>
        <p>No courses match your search criteria. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.tableContainer}
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.tableHeader}>
        <div className={styles.column}>Course Details</div>
        <div className={styles.column}>Category</div>
        <div className={styles.column}>Level</div>
        <div className={styles.column}>Schedule</div>
        <div className={styles.column}>Availability</div>
        <div className={styles.column}>Price</div>
        <div className={styles.column}>Actions</div>
      </div>

      <div className={styles.tableBody}>
        {courses.map((course) => (
          <motion.div 
            key={course.id}
            className={`${styles.courseRow} ${expandedCourseId === course.id ? styles.expanded : ''}`}
            variants={rowVariants}
          >
            {/* Desktop View */}
            <div className={styles.mainRow} onClick={() => handleToggleExpand(course.id)}>
              <div className={styles.column}>
                <div className={styles.courseTitle}>
                  <span className={styles.title}>{course.title}</span>
                </div>
              </div>
              
              <div className={styles.column}>
                <div className={styles.courseCategory}>
                  <span className={styles.categoryLabel}>{course.category}</span>
                </div>
              </div>
              
              <div className={styles.column}>
                <span className={`${styles.levelBadge} ${getLevelBadge(course.level)}`}>
                  {course.level}
                </span>
              </div>
              
              <div className={styles.column}>
                <div className={styles.scheduleInfo}>
                  <div className={styles.scheduleItem}>
                    <CalendarClock size={16} />
                    <span>{course.dates}</span>
                  </div>
                  <div className={styles.scheduleItem}>
                    <Clock size={16} />
                    <span>{course.time}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.column}>
                <div className={`${styles.availabilityIndicator} ${getAvailabilityStatus(course.availability)}`}>
                  <span className={styles.availabilityText}>
                    <Users size={16} />
                    <span>{course.availability} seats left</span>
                  </span>
                </div>
              </div>
              
              <div className={styles.column}>
                <div className={styles.priceTag}>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.amount}>{course.price}</span>
                </div>
              </div>
              
              <div className={styles.column}>
                <div className={styles.actionButtons}>
                  {renderEnrollButton(course)}
                  <button 
                    className={styles.expandButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleExpand(course.id);
                    }}
                  >
                    <ChevronRight 
                      size={20} 
                      className={expandedCourseId === course.id ? styles.rotated : ''}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className={styles.mobileView} onClick={() => handleToggleExpand(course.id)}>
              <div className={styles.mobileHeader}>
                <div className={styles.mobileTitleSection}>
                  <h3 className={styles.mobileTitle}>{course.title}</h3>
                </div>
                <div className={styles.mobileBadges}>
                  <span className={`${styles.levelBadge} ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className={styles.mobileMeta}>
                <div className={styles.mobileCategory}>
                  <Tag size={14} />
                  <span>{course.category}</span>
                </div>
                <div className={styles.mobileScheduleItem}>
                  <CalendarClock size={14} />
                  <span>{course.dates}</span>
                </div>
                <div className={styles.mobileScheduleItem}>
                  <Clock size={14} />
                  <span>{course.time}</span>
                </div>
              </div>
              
              <div className={styles.mobileDetails}>
                <div className={`${styles.availabilityIndicator} ${getAvailabilityStatus(course.availability)}`}>
                  <span className={styles.availabilityText}>
                    <Users size={14} />
                    <span>{course.availability} seats left</span>
                  </span>
                </div>
                
                <div className={styles.mobilePriceTag}>
                  <span className={styles.mobilePrice}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.amount}>{course.price}</span>
                  </span>
                </div>
              </div>
              
              <div className={styles.mobileActions}>
                {renderEnrollButton(course)}
                <button 
                  className={styles.mobileExpandButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(course.id);
                  }}
                >
                  <ChevronRight 
                    size={18} 
                    className={expandedCourseId === course.id ? styles.rotated : ''}
                  />
                </button>
              </div>
            </div>
            
            {expandedCourseId === course.id && (
              <motion.div 
                className={styles.expandedContent}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={styles.courseDetails}>
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Course Description</h4>
                    <p className={styles.courseDescription}>{course.description}</p>
                  </div>
                  
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailsSection}>
                      <h4 className={styles.sectionTitle}>Course Information</h4>
                      <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Mode:</span>
                          <span className={styles.detailValue}>
                            {getModeIcon(course.mode)}
                            {course.mode.charAt(0).toUpperCase() + course.mode.slice(1)}
                          </span>
                        </div>
                        
                        {course.location && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Location:</span>
                            <span className={styles.detailValue}>
                              <MapPin size={16} />
                              {course.location}
                            </span>
                          </div>
                        )}
                        
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Language:</span>
                          <span className={styles.detailValue}>{course.language}</span>
                        </div>
                        
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Duration:</span>
                          <span className={styles.detailValue}>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.detailsSection}>
                      <h4 className={styles.sectionTitle}>Instructor</h4>
                      <div className={styles.instructorInfo}>
                        <div className={styles.instructorAvatar}>
                          {course.instructor.charAt(0)}
                        </div>
                        <span className={styles.instructorName}>{course.instructor}</span>
                      </div>
                    </div>
                    
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className={styles.detailsSection}>
                        <h4 className={styles.sectionTitle}>Prerequisites</h4>
                        <ul className={styles.prerequisitesList}>
                          {course.prerequisites.map((prereq, index) => (
                            <li key={index} className={styles.prerequisiteItem}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {course.certification && (
                      <div className={styles.detailsSection}>
                        <h4 className={styles.sectionTitle}>Certification</h4>
                        <div className={styles.certification}>
                          {course.certification}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.expandedActions}>
                    {course.enrollmentStatus ? (
                      <button 
                        className={`${styles.enrollButtonLarge} ${styles.enrolledButtonLarge}`}
                        disabled
                      >
                        <CheckCircle size={18} />
                        Already Enrolled in This Course
                      </button>
                    ) : (
                      <button 
                        className={styles.enrollButtonLarge}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEnroll(course);
                        }}
                      >
                        Enroll in this Course
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default TrainingCalendarTable;