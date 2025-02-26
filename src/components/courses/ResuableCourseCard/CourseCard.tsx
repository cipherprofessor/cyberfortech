"use client";

import React, { JSX, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Tag,
  Calendar,
  Edit,
  Trash2,
  User,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { formatDistanceToNow, parseISO } from 'date-fns';

import styles from './CourseCard.module.scss';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  priorityLoad?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string, title: string) => void;
  isManagementView?: boolean;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course,
  priorityLoad = false,
  onEdit,
  onDelete,
  isManagementView = false,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State for handling image errors and hover effects
  const [imgError, setImgError] = useState(false);
  const [instructorImgError, setInstructorImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Default fallback images
  const defaultImageUrl = '/cyberimagecoursecover.jpg';
  const defaultInstructorImage = '/team/instructor_default.jpg';
  
  // Determine actual image sources with fallbacks
  const imageSource = imgError || !course.image_url ? defaultImageUrl : course.image_url;
  const instructorImageSource = instructorImgError || 
    !(course.instructor_profile_image_url || course.instructor_avatar) ? 
    defaultInstructorImage : 
    (course.instructor_profile_image_url || course.instructor_avatar);
  
  // Format dates and other display values
  const formattedDate = course.updated_at ? 
    `Updated ${formatDistanceToNow(parseISO(course.updated_at), { addSuffix: true })}` : '';
  
  // Get the review count from either total_reviews or ratings field
  const reviewCount = course.total_reviews || course.ratings || 0;

  // Select appropriate level icon based on course level
  const levelIcon = () => {
    switch(course.level?.toLowerCase() || 'beginner') {
      case 'beginner': return <BookOpen size={14} className={styles.levelIcon} aria-hidden="true" />;
      case 'intermediate': return <TrendingUp size={14} className={styles.levelIcon} aria-hidden="true" />;
      case 'advanced': return <Award size={14} className={styles.levelIcon} aria-hidden="true" />;
      default: return <GraduationCap size={14} className={styles.levelIcon} aria-hidden="true" />;
    }
  };

  // Function to render stars with decimal values
  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.div 
          key={`full-${i}`}
          initial={{ scale: 1 }}
          animate={isHovered ? { 
            scale: [1, 1.2, 1],
            transition: { delay: i * 0.1, duration: 0.3 }
          } : {}}
        >
          <Star
            size={16}
            className={`${styles.starIcon} ${styles.filled}`}
            fill="currentColor"
            aria-hidden="true"
          />
        </motion.div>
      );
    }
    
    // Partial star if needed
    if (decimalPart > 0) {
      stars.push(
        <motion.div 
          key="partial"
          initial={{ scale: 1 }}
          animate={isHovered ? { 
            scale: [1, 1.2, 1],
            transition: { delay: fullStars * 0.1, duration: 0.3 }
          } : {}}
          className={styles.partialStarContainer}
        >
          <Star
            size={16}
            className={`${styles.starIcon} ${styles.filled}`}
            fill="currentColor"
            style={{ clipPath: `inset(0 ${100 - (decimalPart * 100)}% 0 0)` }}
            aria-hidden="true"
          />
          <Star
            size={16}
            className={styles.starIcon}
            aria-hidden="true"
          />
        </motion.div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <motion.div
          key={`empty-${i}`}
          initial={{ scale: 1 }}
          animate={isHovered ? { 
            scale: [1, 1.2, 1],
            transition: { delay: (fullStars + (decimalPart > 0 ? 1 : 0) + i) * 0.1, duration: 0.3 }
          } : {}}
        >
          <Star
            size={16}
            className={styles.starIcon}
            aria-hidden="true"
          />
        </motion.div>
      );
    }
    
    return stars;
  };

  // Format large numbers with K/M suffixes
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Handler functions for management actions
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(course);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(course.id, course.title || 'Untitled Course');
    }
  };

  // Determine if management controls should be shown
  const showManagementControls = isManagementView || (!!onEdit && !!onDelete);

  // The link destination - if it's a management card with click-to-edit, disable the link
  const linkDestination = showManagementControls ? '#' : `/courses/${course.id}`;

  // Apply classes conditionally based on props and theme
  const courseCardClass = `
    ${styles.courseCard} 
    ${isHovered ? styles.hovered : ''} 
    ${isDark ? styles.dark : ''} 
    ${className}
  `;
  
  return (
    <motion.div
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.cardWrapper}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link 
        href={linkDestination}
        onClick={(e) => showManagementControls && e.preventDefault()}
        className={courseCardClass}
        tabIndex={0}
        aria-label={`Course: ${course.title || 'Untitled Course'}`}
      >
        <div className={styles.imageContainer}>
          <motion.div
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            {imageSource && (
              <Image
                src={imageSource}
                alt={course.title || "Course image"}
                fill
                className={styles.image}
                onError={() => setImgError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priorityLoad}
                quality={80}
                loading={priorityLoad ? "eager" : "lazy"}
              />
            )}
          </motion.div>
          
          <motion.div 
            className={`${styles.level} ${styles[course.level?.toLowerCase() || 'beginner']}`}
            animate={isHovered ? { y: -5, x: -5 } : { y: 0, x: 0 }}
            transition={{ duration: 0.3 }}
            aria-label={`Level: ${course.level || 'Beginner'}`}
          >
            {levelIcon()}
            <span>{course.level || 'Beginner'}</span>
          </motion.div>
          
          {isHovered && (
            <>
              {course.category && (
                <motion.div 
                  className={styles.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  aria-label={`Category: ${course.category}`}
                >
                  <Tag size={14} aria-hidden="true" />
                  <span>{course.category}</span>
                </motion.div>
              )}
              
              {course.updated_at && (
                <motion.div 
                  className={styles.updatedAt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  aria-label={`Last updated: ${formattedDate}`}
                >
                  <Calendar size={14} aria-hidden="true" />
                  <span>{formattedDate}</span>
                </motion.div>
              )}
            </>
          )}
        </div>
        
        <div className={styles.content}>
          <motion.h3 
            className={styles.title}
            animate={isHovered ? { color: 'var(--primary-color-light)' } : {}}
            transition={{ duration: 0.3 }}
          >
            {course.title || "Untitled Course"}
          </motion.h3>
          
          <p className={styles.description}>
            {course.description || "No description available"}
          </p>
          
          <div className={styles.instructor}>
            <div className={styles.instructorLabel}>
              <User size={14} aria-hidden="true" />
              <span>Instructor</span>
            </div>
            <div className={styles.instructorInfo}>
              <motion.div 
                className={styles.instructorAvatar}
                animate={isHovered ? { 
                  scale: 1.1, 
                  boxShadow: '0 0 0 2px var(--primary-color-light)' 
                } : {}}
                transition={{ duration: 0.3 }}
              >
                {instructorImageSource && (
                  <Image
                    src={instructorImageSource}
                    alt={course.instructor_name || 'Instructor'}
                    width={28}
                    height={28}
                    className={styles.instructorImage}
                    onError={() => setInstructorImgError(true)}
                  />
                )}
              </motion.div>
              <span className={styles.instructorName}>
                {course.instructor_name || "Unknown Instructor"}
              </span>
            </div>
          </div>
          
          <div className={styles.details}>
            {course.duration && (
              <motion.div 
                className={styles.detailItem}
                animate={isHovered ? { 
                  y: -3, 
                  backgroundColor: 'var(--hover-light)',
                  scale: 1.03
                } : {}}
                transition={{ duration: 0.2 }}
                aria-label={`Duration: ${course.duration}`}
              >
                <Clock size={16} aria-hidden="true" />
                <span>{course.duration}</span>
              </motion.div>
            )}
            
            <motion.div 
              className={styles.detailItem}
              animate={isHovered ? { 
                y: -3, 
                backgroundColor: 'var(--hover-light)',
                scale: 1.03
              } : {}}
              transition={{ duration: 0.2, delay: 0.05 }}
              aria-label={`Students: ${formatNumber(course.total_students || course.enrollment_count || 0)}`}
            >
              <Users size={16} aria-hidden="true" />
              <span>
                {formatNumber(course.total_students || course.enrollment_count || 0)} Students
              </span>
            </motion.div>
          </div>
          
          <div className={styles.footer}>
            <div className={styles.rating}>
              <div className={styles.stars} aria-label={`Rating: ${course.average_rating || 0} out of 5`}>
                {renderStars(course.average_rating || 0)}
              </div>
              <motion.span 
                className={styles.ratingValue}
                animate={isHovered ? { scale: 1.1 } : {}}
                transition={{ duration: 0.2 }}
              >
                {course.average_rating ? 
                  Number(course.average_rating).toFixed(1) : 
                  '0.0'
                }
              </motion.span>
              {reviewCount > 0 && (
                <span className={styles.reviewCount}>
                  ({formatNumber(reviewCount)})
                </span>
              )}
            </div>
            
            <motion.div 
              className={styles.price}
              animate={isHovered ? { 
                scale: 1.08,
                color: 'var(--primary-color-light)' 
              } : {}}
              transition={{ duration: 0.3 }}
              aria-label={`Price: $${course.price?.toFixed(2) || "0.00"}`}
            >
              <DollarSign size={16} aria-hidden="true" />
              <span>{course.price?.toFixed(2) || "0.00"}</span>
            </motion.div>
          </div>
          
          {!showManagementControls && isHovered && (
            <motion.div 
              className={styles.viewCourse}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              View Course
            </motion.div>
          )}
          
          {showManagementControls && (
            <motion.div 
              className={styles.managementControls}
              initial={{ opacity: isHovered ? 1 : 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                className={`${styles.managementButton} ${styles.editButton}`}
                onClick={handleEdit}
                aria-label="Edit course"
                tabIndex={0}
              >
                <Edit size={15} aria-hidden="true" />
                <span>Edit</span>
              </button>
              <button 
                className={`${styles.managementButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                aria-label="Delete course"
                tabIndex={0}
              >
                <Trash2 size={15} aria-hidden="true" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

// Skeleton loader component for CourseCard
export const CourseCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`${styles.cardWrapper} ${styles.skeletonWrapper}`}>
      <div className={`${styles.courseCard} ${styles.skeleton} ${isDark ? styles.dark : ''}`}>
        <div className={styles.imageContainer}>
          <div className={styles.skeletonImage}></div>
          <div className={`${styles.skeletonLevel} ${styles.pulse}`}></div>
        </div>
        
        <div className={styles.content}>
          <div className={`${styles.skeletonTitle} ${styles.pulse}`}></div>
          <div className={`${styles.skeletonDescription} ${styles.pulse}`}></div>
          
          <div className={styles.instructor}>
            <div className={styles.instructorLabel}>
              <div className={`${styles.skeletonIcon} ${styles.pulse}`}></div>
              <div className={`${styles.skeletonText} ${styles.pulse}`} style={{ width: '60px' }}></div>
            </div>
            <div className={styles.instructorInfo}>
              <div className={`${styles.skeletonAvatar} ${styles.pulse}`}></div>
              <div className={`${styles.skeletonText} ${styles.pulse}`} style={{ width: '120px' }}></div>
            </div>
          </div>
          
          <div className={styles.details}>
            <div className={`${styles.skeletonDetail} ${styles.pulse}`}></div>
            <div className={`${styles.skeletonDetail} ${styles.pulse}`}></div>
          </div>
          
          <div className={styles.footer}>
            <div className={styles.rating}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${styles.skeletonStar} ${styles.pulse}`}></div>
                ))}
              </div>
              <div className={`${styles.skeletonText} ${styles.pulse}`} style={{ width: '30px' }}></div>
            </div>
            
            <div className={`${styles.skeletonPrice} ${styles.pulse}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};