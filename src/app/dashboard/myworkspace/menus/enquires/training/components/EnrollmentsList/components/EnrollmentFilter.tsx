// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/EnrollmentFilter.tsx
import { useState, useEffect } from 'react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';
import { getCourses } from '@/services/course-service';

interface Course {
  id: string;
  title: string;
}

interface EnrollmentFilterProps {
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string | null) => void;
  showFilter: boolean;
}

export function EnrollmentFilter({ 
  selectedCourseId, 
  onSelectCourse, 
  showFilter 
}: EnrollmentFilterProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch available courses for filter
  useEffect(() => {
    const fetchCourses = async () => {
      if (!showFilter) return;
      
      setIsLoading(true);
      try {
        const response = await getCourses({ page: 1, limit: 50 });
        // Extract id and title for the dropdown
        const courseOptions = response.courses.map(course => ({
          id: course.id,
          title: course.title
        }));
        setCourses(courseOptions);
      } catch (error) {
        console.error('Failed to fetch courses for filter:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [showFilter]);

  if (!showFilter) return null;

  return (
    <div className={styles.courseFilterDropdown}>
      <button
        className={`${styles.courseOption} ${selectedCourseId === null ? styles.active : ''}`}
        onClick={() => onSelectCourse(null)}
      >
        Show All Enrollments
      </button>
      
      {isLoading ? (
        <div className={styles.filterLoading}>Loading courses...</div>
      ) : (
        courses.map(course => (
          <button
            key={course.id}
            className={`${styles.courseOption} ${selectedCourseId === course.id ? styles.active : ''}`}
            onClick={() => onSelectCourse(course.id)}
          >
            {course.title}
          </button>
        ))
      )}
    </div>
  );
}