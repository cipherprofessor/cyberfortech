"use client"
import { useState } from 'react';
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
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './CourseCard.module.scss';

export function CourseCard({ course }: CourseCardProps) {
  const defaultImageUrl = '/cyberimagecoursecover.jpg';
  const [imgError, setImgError] = useState(false);
  const defaultInstructorImage = '/team/instructor_default.jpg'; // Add a default avatar image
  const [instructorImgError, setInstructorImgError] = useState(false);

  const imageSource = imgError ? defaultImageUrl : course.image_url;

  const levelIcon = () => {
    switch(course.level.toLowerCase()) {
      case 'beginner': return <BookOpen size={14} />;
      case 'intermediate': return <TrendingUp size={14} />;
      case 'advanced': return <Award size={14} />;
      default: return <GraduationCap size={14} />;
    }
  };

  // Function to render stars with decimal values
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className={`${styles.starIcon} ${styles.filled}`}
          fill="currentColor"
        />
      );
    }
    
    // Partial star if needed
    if (decimalPart > 0) {
      stars.push(
        <div key="partial" className={styles.partialStarContainer}>
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
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          className={styles.starIcon}
        />
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.cardWrapper}
    >
      <Link 
        href={`/courses/${course.id}`} 
        className={styles.courseCard}
      >
        <div className={styles.imageContainer}>
          <Image
            src={imageSource}
            alt={course.title}
            fill
            className={styles.image}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            quality={75}
            loading="lazy"
          />
          <div className={`${styles.level} ${styles[course.level.toLowerCase()]}`}>
            {levelIcon()}
            <span>{course.level}</span>
          </div>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{course.title}</h3>
          <p className={styles.description}>{course.description}</p>
          
          <div className={styles.instructor}>
  <div className={styles.instructorAvatar}>
    <Image
      src={instructorImgError ? defaultInstructorImage : (course.instructor_profile_image_url || defaultInstructorImage)}
      alt={course.instructor_name || 'Instructor'}
      width={24}
      height={24}
      className={styles.instructorImage}
      onError={() => setInstructorImgError(true)}
    />
  </div>
  <span>{course.instructor_name}</span>
</div>
          
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
            <div className={styles.detailItem}>
              <Users size={16} />
              <span>
                {formatNumber(course.total_students || course.enrollment_count || 0)}
              </span>
            </div>
          </div>
          
          <div className={styles.footer}>
            <div className={styles.rating}>
              <div className={styles.stars}>
                {renderStars(course.average_rating || 0)}
              </div>
              <span className={styles.ratingValue}>
                {course.average_rating ? 
                  Number(course.average_rating).toFixed(1) : 
                  '0.0'
                }
              </span>
            </div>
            
            <div className={styles.price}>
              <DollarSign size={16} />
              <span>{course.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}