// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/CourseCard/CourseCard.tsx
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
  return (
    <motion.div
      className={styles.courseCard}
      whileHover={{ y: -5 }}
    >
      <div className={styles.courseImage}>
        <img 
          src={course.image_url || '/default-course.jpg'} 
          alt={course.title}
          className={styles.image}
        />
        <div className={styles.courseLevel}>{course.level}</div>
      </div>

      <div className={styles.courseInfo}>
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <div className={styles.courseStats}>
          <div className={styles.stat}>
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className={styles.stat}>
            <Users size={16} />
            <span>{course.total_students || 0} students</span>
          </div>
          <div className={styles.stat}>
            <Star size={16} />
            <span>{course.average_rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <div className={styles.courseActions}>
          <button
            onClick={() => onEdit(course)}
            className={styles.editButton}
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(course.id, course.title)}
            className={styles.deleteButton}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};