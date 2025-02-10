"use client"
import { useCallback, useEffect, useState } from 'react';

import styles from './CourseList.module.scss';
import { CourseCard } from '../CourseCard/CourseCard';
import { CourseCardPlaceholder } from '../CourseCard/CourseCardPlaceholder';
import { Button, Pagination } from '@heroui/react';
import { CourseFilter } from '../CourseFilter/CourseFilter';



export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]); // Initialize with empty array
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...courses];
  
    // Apply sorting
    filtered.sort((a, b) => {
      const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'newest':
          return multiplier * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case 'price':
          return multiplier * (a.price - b.price);
        case 'rating':
          return multiplier * (a.average_rating - b.average_rating);
        case 'duration':
          return multiplier * (parseInt(a.duration) - parseInt(b.duration));
        default:
          return 0;
      }
    });


    // Filter by price range
    filtered = filtered.filter(course => 
      course.price >= filters.priceRange[0] && 
      course.price <= filters.priceRange[1]
    );

    // Filter by level
    if (filters.selectedLevels.length > 0) {
      filtered = filtered.filter(course => 
        filters.selectedLevels.includes(course.level)
      );
    }

    // Filter by category
    if (filters.selectedCategories && filters.selectedCategories.length > 0) {
      filtered = filtered.filter(course => {
        // console.log('Course category:', course.category); // Debug log
        return filters.selectedCategories.includes(course.category.trim());
      });
    }
    // Filter by duration
    if (filters.durationRange !== 'all') {
      filtered = filtered.filter(course => {
        const hours = parseInt(course.duration);
        switch(filters.durationRange) {
          case 'short': return hours <= 4;
          case 'medium': return hours > 4 && hours <= 8;
          case 'long': return hours > 8;
          default: return true;
        }
      });
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(course => 
        course.average_rating >= filters.minRating
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.instructor_name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className={styles.courseListContainer}>
      <div className={styles.content}>
        <aside className={styles.filterSection}>
          <CourseFilter 
            onFilterChange={handleFilterChange}
            courses={courses}
          />
        </aside>

        <main className={styles.mainContent}>
          {loading ? (
            <div className={styles.courseGrid}>
              {Array.from({ length: coursesPerPage }).map((_, index) => (
                <CourseCardPlaceholder key={index} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No courses found</h3>
              <p>Try adjusting your filters to find what you're looking for</p>
            </div>
          ) : (
            <>
              <div className={styles.courseGrid}>
                {currentCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Pagination
                    total={totalPages}
                    initialPage={1}
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}