"use client"
import { JSX, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Award,
  Tag,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './CourseCard.module.scss';
import { CourseCardProps } from '@/types/courses';
import { formatDistanceToNow, parseISO } from 'date-fns';

export function CourseCard({ 
  course, 
  priorityLoad,
  onEdit,
  onDelete
}: CourseCardProps) {
  const defaultImageUrl = '/cyberimagecoursecover.jpg';
  const [imgError, setImgError] = useState(false);
  const defaultInstructorImage = '/team/instructor_default.jpg';
  const [instructorImgError, setInstructorImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageSource = imgError || !course.image_url ? defaultImageUrl : course.image_url;
  const instructorImageSource = instructorImgError || !course.instructor_avatar ? 
    defaultInstructorImage : course.instructor_avatar;
    
  // Format update date if available
  const formattedDate = course.updated_at ? 
    `Updated ${formatDistanceToNow(parseISO(course.updated_at), { addSuffix: true })}` : '';

  const levelIcon = () => {
    switch(course.level?.toLowerCase() || 'beginner') {
      case 'beginner': return <BookOpen size={14} className={styles.levelIcon} />;
      case 'intermediate': return <TrendingUp size={14} className={styles.levelIcon} />;
      case 'advanced': return <Award size={14} className={styles.levelIcon} />;
      default: return <GraduationCap size={14} className={styles.levelIcon} />;
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
          />
          <Star
            size={16}
            className={styles.starIcon}
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
          />
        </motion.div>
      );
    }
    
    return stars;
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Functions for edit/delete actions (only used in management view)
  const handleEdit = () => {
    if (onEdit) {
      onEdit(course);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(course.id, course.title || 'Untitled Course');
    }
  };

  // Determine if this is a management card with edit/delete options
  const isManagementCard = !!onEdit && !!onDelete;

  // The link destination - if it's a management card, disable the link
  const linkDestination = isManagementCard ? '#' : `/courses/${course.id}`;

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
        onClick={(e) => isManagementCard && e.preventDefault()}
        className={`${styles.courseCard} ${isHovered ? styles.hovered : ''}`}
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
                priority={priorityLoad ?? false}
                quality={80}
                loading={priorityLoad ? "eager" : "lazy"}
              />
            )}
          </motion.div>
          
          <motion.div 
            className={`${styles.level} ${styles[course.level?.toLowerCase() || 'beginner']}`}
            animate={isHovered ? { y: -5, x: -5 } : { y: 0, x: 0 }}
            transition={{ duration: 0.3 }}
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
                >
                  <Tag size={14} />
                  <span>{course.category}</span>
                </motion.div>
              )}
              
              {course.updated_at && (
                <motion.div 
                  className={styles.updatedAt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Calendar size={14} />
                  <span>{formattedDate}</span>
                </motion.div>
              )}
            </>
          )}
          
          {isManagementCard && isHovered && (
            <motion.div 
              className={styles.actionButtons}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={handleEdit}
                aria-label="Edit course"
              >
                Edit
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                aria-label="Delete course"
              >
                Delete
              </button>
            </motion.div>
          )}
        </div>
        
        <div className={styles.content}>
          <motion.h3 
            className={styles.title}
            animate={isHovered ? { color: 'var(--primary-color, #3b82f6)' } : {}}
            transition={{ duration: 0.3 }}
          >
            {course.title || "Untitled Course"}
          </motion.h3>
          
          <p className={styles.description}>{course.description || "No description available"}</p>
          
          <div className={styles.instructor}>
            <motion.div 
              className={styles.instructorAvatar}
              animate={isHovered ? { 
                scale: 1.1, 
                boxShadow: '0 0 0 2px rgba(var(--primary-color-rgb, 59, 130, 246), 0.5)' 
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
            <span className={styles.instructorName}>{course.instructor_name || "Unknown Instructor"}</span>
          </div>
          
          <div className={styles.details}>
            <motion.div 
              className={styles.detailItem}
              animate={isHovered ? { 
                y: -3, 
                backgroundColor: 'var(--hover-highlight, rgba(59, 130, 246, 0.15))',
                scale: 1.03
              } : {}}
              transition={{ duration: 0.2 }}
            >
              <Clock size={16} />
              <span>{course.duration || "N/A"}</span>
            </motion.div>
            
            <motion.div 
              className={styles.detailItem}
              animate={isHovered ? { 
                y: -3, 
                backgroundColor: 'var(--hover-highlight, rgba(59, 130, 246, 0.15))',
                scale: 1.03
              } : {}}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <Users size={16} />
              <span>
                {formatNumber(course.total_students || course.enrollment_count || 0)} Students
              </span>
            </motion.div>
          </div>
          
          <div className={styles.footer}>
            <div className={styles.rating}>
              <div className={styles.stars}>
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
              {course.ratings || 0 > 0 && (
                <span className={styles.reviewCount}>
                  ({formatNumber(course.ratings || 0)})
                </span>
              )}
            </div>
            
            <motion.div 
              className={styles.price}
              animate={isHovered ? { 
                scale: 1.08,
                color: 'var(--primary-color-bright, #2563eb)' 
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <DollarSign size={16} />
              <span>{course.price?.toFixed(2) || "0.00"}</span>
            </motion.div>
          </div>
          
          {!isManagementCard && isHovered && (
            <motion.div 
              className={styles.viewCourse}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              View Course
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}