// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/EnrollmentsList.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './EnrollmentsList.module.scss';

// Import service functions
import { getUserEnrollments, updateEnrollment } from '@/services/enrollment-service';

// Import components


// Import types

import EditEnrollmentModal from '../../modals/EditEnrollmentModal';
import ViewEnrollmentModal from '../../modals/ViewEnrollmentModal';
import { EmptyState } from '../EmptyState';
import { EnrollmentFilter } from '../EnrollmentFilter';
import { EnrollmentHeader } from '../EnrollmentHeader';
import { EnrollmentPagination } from '../EnrollmentPagination';
import { EnrollmentTable } from '../EnrollmentTable';
import { ErrorState } from '../ErrorState';
import { LoadingState } from '../LoadingState';

import { Enrollment, EnrollmentFilters, PaginationInfo } from '../../types';

interface EnrollmentsListProps {
  filters: EnrollmentFilters;
}

export default function EnrollmentsList({ filters: initialFilters }: EnrollmentsListProps) {
  // State for enrollments data
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Filter state
  const [filters, setFilters] = useState<EnrollmentFilters>(initialFilters || {});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showCourseFilter, setShowCourseFilter] = useState(false);
  
  // Modal state
  const [viewingEnrollment, setViewingEnrollment] = useState<Enrollment | null>(null);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);

  // Fetch enrollments when filters or pagination changes
  useEffect(() => {
    fetchEnrollments();
  }, [pagination.page, filters, selectedCourseId]);

  // Fetch enrollments from API
  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user enrollments with pagination
      const response = await getUserEnrollments(
        pagination.page, 
        pagination.limit,
        filters.status
      );
      
      // Filter by course if selected
      let filteredEnrollments = response.enrollments;
      if (selectedCourseId) {
        filteredEnrollments = response.enrollments.filter(
          enrollment => enrollment.courseId === selectedCourseId
        );
      }
      
      setEnrollments(filteredEnrollments);
      setPagination({
        ...pagination,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch enrollments. Please try again.';
      setError(errorMessage);
      console.error('Error fetching enrollments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Toggle course filter
  const handleToggleCourseFilter = () => {
    setShowCourseFilter(!showCourseFilter);
  };

  // Select a course
  const handleSelectCourse = (courseId: string | null) => {
    setSelectedCourseId(courseId);
    setShowCourseFilter(false);
  };
  
  // Open view enrollment modal
  const handleViewEnrollment = (enrollment: Enrollment) => {
    setViewingEnrollment(enrollment);
  };
  
  // Open edit enrollment modal
  const handleEditEnrollment = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
  };
  
  // Handle enrollment update
  const handleEnrollmentUpdate = (updatedEnrollment: Enrollment) => {
    // Update enrollment in list
    setEnrollments(prevEnrollments => 
      prevEnrollments.map(enrollment => 
        enrollment.id === updatedEnrollment.id 
          ? { ...enrollment, ...updatedEnrollment }
          : enrollment
      )
    );
  };
  
  // Close modals
  const handleCloseModals = () => {
    setViewingEnrollment(null);
    setEditingEnrollment(null);
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

  // Loading state
  if (isLoading && !enrollments.length) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchEnrollments} />;
  }

  // Empty state
  if (enrollments.length === 0) {
    return (
      <EmptyState 
        courseId={selectedCourseId} 
        onReset={() => setSelectedCourseId(null)} 
      />
    );
  }

  return (
    <div className={styles.enrollmentsContainer}>
      <EnrollmentHeader 
        selectedCourseId={selectedCourseId} 
        onToggleFilter={handleToggleCourseFilter} 
      />
      
      <EnrollmentFilter 
        selectedCourseId={selectedCourseId}
        onSelectCourse={handleSelectCourse}
        showFilter={showCourseFilter}
      />
      
      <EnrollmentTable 
        enrollments={enrollments}
        onViewEnrollment={handleViewEnrollment}
        onEditEnrollment={handleEditEnrollment}
      />
      
      <EnrollmentPagination 
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      
      {/* View Enrollment Modal */}
      {viewingEnrollment && (
        <ViewEnrollmentModal
          enrollment={viewingEnrollment}
          onClose={handleCloseModals}
        />
      )}
      
      {/* Edit Enrollment Modal */}
      {editingEnrollment && (
        <EditEnrollmentModal
          enrollment={editingEnrollment}
          onClose={handleCloseModals}
          onUpdate={handleEnrollmentUpdate}
        />
      )}
    </div>
  );
}