import { useEffect, useState } from 'react';
// import { CourseCard } from '../CourseCard';
// import { Pagination } from '@/components/common/Pagination';
// import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import styles from './CourseList.module.scss';

type Course = {
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

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div className={styles.courseListContainer}>
      <div className={styles.courseGrid}>
        {currentCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(courses.length / coursesPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}