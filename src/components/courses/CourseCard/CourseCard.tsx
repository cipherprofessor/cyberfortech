import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from './CourseCard.module.scss';

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    duration: string;
    level: string;
    price: number;
    rating: number;
    studentsEnrolled: number;
  };
};

export function CourseCard({ course }: CourseCardProps) {
  const defaultImageUrl = '/cyberimagecoursecover.jpg';

  return (
    <Link href={`/courses/${course.id}`} className={styles.courseCard}>
      <div className={styles.imageContainer}>
        <Image
          src={course.imageUrl || defaultImageUrl}
          alt={course.title}
          fill
          className={styles.image}
        />
        <div className={styles.level}>{course.level}</div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>
        
        <div className={styles.details}>
          <span className={styles.duration}>{course.duration}</span>
          <span className={styles.students}>
            {course.studentsEnrolled ? course.studentsEnrolled.toLocaleString() : '0'} students
          </span>
        </div>
        
        <div className={styles.footer}>
          <div className={styles.rating}>
            <Star className={styles.starIcon} />
            <span>{course.rating !== undefined ? course.rating.toFixed(1) : '0.0'}</span>
          </div>
          
          <div className={styles.price}>
            ${course.price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}