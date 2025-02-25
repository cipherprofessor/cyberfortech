// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/CourseCard/CourseCard.tsx
import { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Clock, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Course } from '@/types/courses';
import styles from './CourseCard.module.scss';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string, courseName: string) => void;
}

export const CourseCard = ({ course, onEdit, onDelete }: CourseCardProps) => {
  const [imgError, setImgError] = useState(false);
  const defaultImageUrl = '/cyberlogo.jpg';

  return (
    <motion.div
      className={styles.cardWrapper}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.courseCard}>
        <div className={styles.imageContainer}>
          <Image
            src={imgError ? defaultImageUrl : course.image_url}
            alt={course.title}
            fill
            className={styles.image}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {course.level && (
            <div className={`${styles.level} ${styles[course.level.toLowerCase()]}`}>
              {course.level}
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{course.title}</h3>
          <p className={styles.description}>{course.description}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
            <div className={styles.stat}>
              <Users size={16} />
              <span>{course.total_students || 0}</span>
            </div>
            <div className={styles.stat}>
              <Star size={16} />
              <span>{course.average_rating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => onEdit(course)}
              className={styles.editButton}
              aria-label="Edit course"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(course.id, course.title)}
              className={styles.deleteButton}
              aria-label="Delete course"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};