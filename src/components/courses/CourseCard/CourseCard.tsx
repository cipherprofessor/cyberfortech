import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from './CourseCard.module.scss';

// type CourseCardProps = {
//   course: {
//     id: string;
//     title: string;
//     description: string;
//     image_url: string; // Changed from imageUrl to match API
//     duration: string;
//     level: string;
//     price: number;
//     average_rating: number; // Changed from rating to match API
//     total_students: number; // Changed from studentsEnrolled to match API
//     instructor_name: string;
//     category: string;
//   };
// };

export function CourseCard({ course }: CourseCardProps) {
  const defaultImageUrl = '/cyberimagecoursecover.jpg';
  const [imgError, setImgError] = useState(false);

  const imageSource = imgError ? defaultImageUrl : course.image_url;

  return (
    <Link href={`/courses/${course.id}`} className={styles.courseCard}>
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
        <div className={styles.level}>{course.level}</div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>
        
        <div className={styles.details}>
          <span className={styles.duration}>{course.duration}</span>
          <span className={styles.students}>
            {course.total_students ? (course.enrollment_count ?? 0).toLocaleString() : '0'} Students
          </span>
        </div>
        
        <div className={styles.footer}>
       

<div className={styles.rating}>
  <Star className={styles.starIcon} />
  <span>
    {course.average_rating != null 
      ? Number(course.average_rating).toFixed(1) 
      : '0.0'
    }
  </span>
</div>
          
          <div className={styles.price}>
            ${course.price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}