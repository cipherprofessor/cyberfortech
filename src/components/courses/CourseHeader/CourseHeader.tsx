import Image from 'next/image';
import { Star, Clock, BarChart, Globe, Award } from 'lucide-react';
import styles from './CourseHeader.module.scss';
import BreadCrumbsUnderline from '@/components/ui/HeroUI/BreadCumbs/BreadCrumbsUnderline';

type CourseHeaderProps = {
  course: {
    title: string;
    description: string;
    instructor: {
      name: string;
      title: string;
      avatar: string;
    };
    rating: number;
    studentsEnrolled: number;
    lastUpdated: string;
    language: string;
    level: string;
  };
};

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.breadcrumbs}>
        <BreadCrumbsUnderline />
      </div>
      
      <h1 className={styles.title}>{course.title}</h1>
      <p className={styles.description}>{course.description}</p>
      
      <div className={styles.stats}>
        <div className={styles.rating}>
          <Star className={styles.icon} />
          <span>{course.rating}</span>
          <span className={styles.studentsCount}>
            ({course.studentsEnrolled.toLocaleString()} students)
          </span>
        </div>
        
        <div className={styles.stat}>
          <Clock className={styles.icon} />
          <span>Last updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
        </div>
        
        <div className={styles.stat}>
          <Globe className={styles.icon} />
          <span>{course.language}</span>
        </div>
        
        <div className={styles.stat}>
          <BarChart className={styles.icon} />
          <span>{course.level}</span>
        </div>
        
        <div className={styles.stat}>
          <Award className={styles.icon} />
          <span>Certificate of Completion</span>
        </div>
      </div>
      
      <div className={styles.instructor}>
        <Image
          src={course.instructor.avatar}
          alt={course.instructor.name}
          width={48}
          height={48}
          className={styles.avatar}
        />
        <div className={styles.instructorInfo}>
          <span className={styles.instructorName}>{course.instructor.name}</span>
          <span className={styles.instructorTitle}>{course.instructor.title}</span>
        </div>
      </div>
    </div>
  );
}