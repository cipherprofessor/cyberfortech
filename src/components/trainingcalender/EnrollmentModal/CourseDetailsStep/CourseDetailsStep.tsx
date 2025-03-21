// src/components/trainingcalender/EnrollmentModal/CourseDetailsStep.tsx
"use client"
import { Calendar, Clock, Users, BadgeCheck, ChevronRight } from 'lucide-react';
import styles from './CourseDetailsStep.module.scss';
import { TrainingCourse } from '@/app/(routes)/trainingcalender/traininghooks';
import { EnrollmentStep } from '../types';


interface CourseDetailsStepProps {
  course: TrainingCourse;
  onStepChange: (step: EnrollmentStep) => void;
  isProcessing: boolean;
}

export const CourseDetailsStep: React.FC<CourseDetailsStepProps> = ({ 
  course, 
  onStepChange,
  isProcessing 
}) => {
  // Function to get level badge style
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
    <div className={styles.modalContent}>
      <div className={styles.courseOverview}>
        <div className={styles.courseHeader}>
          <h4 className={styles.courseTitle}>{course.title}</h4>
          <span className={`${styles.courseBadge} ${getLevelBadge(course.level)}`}>
            {course.level}
          </span>
        </div>
        
        <p className={styles.courseDescription}>{course.description}</p>
        
        <div className={styles.courseInfoGrid}>
          <div className={styles.infoItem}>
            <Calendar size={16} />
            <span className={styles.infoLabel}>Dates:</span>
            <span className={styles.infoValue}>{course.dates}</span>
          </div>
          
          <div className={styles.infoItem}>
            <Clock size={16} />
            <span className={styles.infoLabel}>Time:</span>
            <span className={styles.infoValue}>{course.time}</span>
          </div>
          
          <div className={styles.infoItem}>
            <Users size={16} />
            <span className={styles.infoLabel}>Availability:</span>
            <span className={styles.infoValue}>{course.availability} seats left</span>
          </div>
          
          {course.certification && (
            <div className={styles.infoItem}>
              <BadgeCheck size={16} />
              <span className={styles.infoLabel}>Certification:</span>
              <span className={styles.infoValue}>{course.certification}</span>
            </div>
          )}
        </div>
        
        <div className={styles.pricingSection}>
          <div className={styles.priceTag}>
            <span className={styles.priceLabel}>Course Fee:</span>
            <span className={styles.priceAmount}>
              <span className={styles.priceCurrency}>₹</span>
              {course.price}
            </span>
          </div>
          
          <button 
            className={styles.proceedButton}
            onClick={() => onStepChange(EnrollmentStep.FORM)}
            disabled={isProcessing}
          >
            Proceed to Registration
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsStep;