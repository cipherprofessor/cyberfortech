"use client"
import { useCallback, useEffect, useState, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import { Filter, Search, SlidersHorizontal, X, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

import styles from './CourseList.module.scss';

import { CourseFilter } from '../CourseFilter/CourseFilter';
import { Course, FilterState } from '../types';
import { CourseCard, CourseCardSkeleton } from '../ResuableCourseCard/CourseCard';


interface CourseListProps {
  isFilterOpen?: boolean;
}

export function CourseList({ isFilterOpen = false }: CourseListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [courses, setCourses] = useState<Course[]>([]); 
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);
  const coursesPerPage = 9;

  // Set mounted state after component mounts to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    const isWideScreen = window.innerWidth > 768;
    setShowFilters(isWideScreen || isFilterOpen);
  }, [isFilterOpen]);

  // Listen for isFilterOpen prop changes - only after mounting to avoid hydration errors
  useEffect(() => {
    if (isMounted) {
      const isWideScreen = window.innerWidth > 768;
      setShowFilters(isWideScreen || isFilterOpen);
    }
  }, [isFilterOpen, isMounted]);

  // Check scroll position to show/hide scroll to top button
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      setScrollToTopVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
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
          return multiplier * (new Date(b.createdAt || b.created_at || Date.now()).getTime() - 
                               new Date(a.createdAt || a.created_at || Date.now()).getTime());
        case 'price':
          return multiplier * ((a.price || 0) - (b.price || 0));
        case 'rating':
          return multiplier * ((a.average_rating || 0) - (b.average_rating || 0));
        case 'duration':
          const durationA = a.duration ? parseInt(a.duration) : 0;
          const durationB = b.duration ? parseInt(b.duration) : 0;
          return multiplier * (durationA - durationB);
        default:
          return 0;
      }
    });

    // Filter by price range
    filtered = filtered.filter(course => 
      (course.price || 0) >= filters.priceRange[0] && 
      (course.price || 0) <= filters.priceRange[1]
    );

    // Filter by level
    if (filters.selectedLevels.length > 0) {
      filtered = filtered.filter(course => 
        course.level && filters.selectedLevels.includes(course.level)
      );
    }

    // Filter by category
    if (filters.selectedCategories && filters.selectedCategories.length > 0) {
      filtered = filtered.filter(course => {
        return course.category && filters.selectedCategories.includes(course.category.trim());
      });
    }
    
    // Filter by duration
    if (filters.durationRange !== 'all') {
      filtered = filtered.filter(course => {
        const hours = course.duration ? parseInt(course.duration) : 0;
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
        (course.average_rating || 0) >= filters.minRating
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        (course.title?.toLowerCase() || '').includes(searchLower) ||
        (course.description?.toLowerCase() || '').includes(searchLower) ||
        (course.instructor_name?.toLowerCase() || '').includes(searchLower)
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Custom pagination renderer
  const renderPagination = () => {
    const pageNumbers: ReactNode[] = [];
    const maxVisiblePages = 5;
    
    // Calculate range of page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pageNumbers.push(
      <button
        key="prev"
        className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
    );
    
    // First page button if not included in range
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(1)}
          aria-label={`Page 1`}
          aria-current={currentPage === 1 ? 'page' : undefined}
        >
          1
        </button>
      );
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className={styles.paginationButton}>
            ...
          </span>
        );
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.paginationButton} ${currentPage === i ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(i)}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className={styles.paginationButton}>
            ...
          </span>
        );
      }
      
      pageNumbers.push(
        <button
          key={totalPages}
          className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(totalPages)}
          aria-label={`Page ${totalPages}`}
          aria-current={currentPage === totalPages ? 'page' : undefined}
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    pageNumbers.push(
      <button
        key="next"
        className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    );
    
    return (
      <div className={styles.paginationContainer}>
        {pageNumbers}
      </div>
    );
  };

  // Pagination scroll handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid with smooth animation
    if (isMounted) {
      document.querySelector(`.${styles.mainContent}`)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    if (isMounted) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Conditional rendering to avoid hydration issues
  if (!isMounted) {
    return (
      <div className={styles.courseListContainer}>
        <div className={styles.content}>
          <main className={styles.mainContent}>
            <div className={styles.courseGrid}>
              {Array.from({ length: coursesPerPage }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.courseListContainer} ${isDark ? styles.dark : ''}`}>
      <div className={styles.content}>
        {isMounted && (
          <>
            {showFilters && (
              <aside className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <h2>Filters</h2>
                  {window.innerWidth <= 768 && (
                    <button 
                      className={styles.closeButton}
                      onClick={toggleFilters}
                      aria-label="Close filters"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <CourseFilter 
                  onFilterChange={handleFilterChange}
                  courses={courses}
                />
              </aside>
            )}
          </>
        )}

        <main className={styles.mainContent}>
          {loading ? (
            <div className={styles.courseGrid}>
              {Array.from({ length: coursesPerPage }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <Search size={64} strokeWidth={1.5} />
              </div>
              <h3>No courses found</h3>
              <p>Try adjusting your filters to find what you're looking for</p>
              <Button 
                onClick={() => handleFilterChange({
                  sortBy: 'newest',
                  sortOrder: 'desc',
                  priceRange: [0, 1000],
                  selectedCategories: [],
                  selectedLevels: [],
                  durationRange: 'all',
                  minRating: 0,
                  search: ''
                })} 
                className={styles.resetButton}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.resultsSummary}>
                Showing <span>{filteredCourses.length}</span> courses
              </div>
              
              <div className={styles.courseGrid}>
                {currentCourses.map((course) => (
                  <div key={course.id}>
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {scrollToTopVisible && (
        <button
          className={styles.scrollToTop}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}