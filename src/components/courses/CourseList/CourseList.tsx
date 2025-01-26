"use client"
import { useEffect, useState } from 'react';
import styles from './CourseList.module.scss';
import { CourseCard } from '../CourseCard/CourseCard';
// import { Pagination } from '@heroui/react';
import { CourseCardPlaceholder } from '../CourseCard/CourseCardPlaceholder';
import { Button, Pagination } from '@heroui/react';
// CourseList.tsx

type Course = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  level: string;
  price: number;
  average_rating: number;
  total_students: number;
  instructor_name: string;
  category: string;
  instructor_avatar?: string;
  total_reviews?: number;
  created_at?: string;
  updated_at?: string;
  instructor_id?: string;
};

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  useEffect(() => {
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

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div className={styles.courseListContainer}>
      <div className={styles.courseGrid}>
        {loading
          ? Array.from({ length: coursesPerPage }).map((_, index) => (
              <CourseCardPlaceholder key={index} />
            ))
          : currentCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
      </div>
      
      {!loading && (
        <Pagination
          page={currentPage}
          total={Math.ceil(courses.length / coursesPerPage)}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
}