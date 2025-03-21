// src/app/dashboard/myworkspace/menus/enquires/training/components/TrainingCoursesList/TrainingCoursesList.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Loader2,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import styles from './TrainingCoursesList.module.scss';

import { 
  getCourses,
  deleteCourse,
  Course,
  CourseFilters 
} from '@/services/course-service';

interface TrainingCoursesListProps {
  filters: CourseFilters;
  onEditCourse: (course: Course) => void;
}

export default function TrainingCoursesList({ 
  filters,
  onEditCourse
}: TrainingCoursesListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Fetch courses
  useEffect(() => {
    const fetchCoursesData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getCourses(filters);
        setCourses(response.courses);
        setPagination(response.pagination);
      } catch (err) {
        setError('Failed to fetch courses. Please try again.');
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoursesData();
  }, [filters]);

  // Handle delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setIsDeleting(courseId);
      
      try {
        await deleteCourse(courseId);
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      } catch (err) {
        alert('Failed to delete course. Please try again.');
        console.error('Error deleting course:', err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const updatedFilters = { ...filters, page: newPage };
    // This will trigger the useEffect
    window.location.search = new URLSearchParams(
      Object.entries(updatedFilters).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
  };

  // Toggle expanded course
  const toggleExpandCourse = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={36} className={styles.loadingSpinner} />
        <p>Loading courses...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={36} className={styles.errorIcon} />
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Calendar size={48} className={styles.emptyIcon} />
        <h3>No Courses Found</h3>
        <p>No courses match your current filters or there are no courses yet.</p>
        <button 
          className={styles.createButton}
          onClick={() => window.dispatchEvent(new CustomEvent('create-course'))}
        >
          Create Your First Course
        </button>
      </div>
    );
  }

  return (
    <div className={styles.coursesListContainer}>
      <div className={styles.coursesHeader}>
        <h2>Training Courses</h2>
        <p>Manage your training courses and check their status</p>
      </div>

      <motion.div 
        className={styles.coursesGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {courses.map((course) => (
          <motion.div 
            key={course.id} 
            className={`${styles.courseCard} ${expandedCourseId === course.id ? styles.expanded : ''}`}
            variants={itemVariants}
          >
            <div 
              className={styles.courseHeader}
              onClick={() => toggleExpandCourse(course.id)}
            >
              <div className={styles.courseInfo}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <div className={styles.courseDetails}>
                  <span className={styles.courseCategory}>{course.category}</span>
                  <span className={`${styles.courseLevel} ${styles[course.level]}`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                  <span className={`${styles.courseMode} ${styles[course.mode]}`}>
                    {course.mode.charAt(0).toUpperCase() + course.mode.slice(1)}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                {isDeleting === course.id ? (
                  <Loader2 size={18} className={styles.loadingSpinner} />
                ) : (
                  <>
                    <button 
                      className={styles.editButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCourse(course);
                      }}
                      aria-label="Edit course"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                      aria-label="Delete course"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className={`${styles.expandButton} ${expandedCourseId === course.id ? styles.rotated : ''}`}
                      aria-label={expandedCourseId === course.id ? "Collapse" : "Expand"}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {expandedCourseId === course.id && (
              <motion.div 
                className={styles.courseContent}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={styles.courseDescription}>
                  <p>{course.description}</p>
                </div>
                
                <div className={styles.courseMetadata}>
                  <div className={styles.metadataItem}>
                    <Calendar size={16} />
                    <span>{course.dates}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <Clock size={16} />
                    <span>{course.time} • {course.duration}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <Users size={16} />
                    <span>{course.availability} seats available • {course.currentEnrollment} enrolled</span>
                  </div>
                </div>
                
                <div className={styles.courseStatus}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Status:</span>
                    <span className={`${styles.statusValue} ${course.isActive ? styles.active : styles.inactive}`}>
                      {course.isActive ? (
                        <>
                          <CheckCircle2 size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Price:</span>
                    <span className={styles.statusValue}>₹{course.price}</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Created:</span>
                    <span className={styles.statusValue}>{formatDate(course.createdAt)}</span>
                  </div>
                </div>
                
                <div className={styles.expandedActions}>
                  <button 
                    className={styles.previewButton}
                    onClick={() => window.open(`/training/${course.id}`, '_blank')}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button 
                    className={styles.editFullButton}
                    onClick={() => onEditCourse(course)}
                  >
                    <Edit size={16} />
                    Edit Course
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <span className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button 
            className={styles.paginationButton}
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}