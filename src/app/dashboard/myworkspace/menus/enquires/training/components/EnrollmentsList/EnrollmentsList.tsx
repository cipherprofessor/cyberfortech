// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/EnrollmentsList.tsx

"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Circle,
  DollarSign,
  Mail,
  Phone,
  Filter
} from 'lucide-react';
import styles from './EnrollmentsList.module.scss';

// Import service functions
import { getUserEnrollments } from '@/services/enrollment-service'; 

interface EnrollmentsListProps {
  filters: any;
}

export default function EnrollmentsList({ filters }: EnrollmentsListProps) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showCourseFilter, setShowCourseFilter] = useState(false);

  // Fetch enrollments
  useEffect(() => {
    fetchEnrollments();
  }, [pagination.page, filters, selectedCourseId]);

  // Fetch all enrollments or filter by course if selected
  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get all user enrollments (for admin view)
      const response = await getUserEnrollments(pagination.page, pagination.limit);
      
      // If a course is selected, filter enrollments
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
      setError('Failed to fetch enrollments. Please try again.');
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className={`${styles.statusBadge} ${styles.confirmed}`}>
            <CheckCircle size={14} />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className={`${styles.statusBadge} ${styles.pending}`}>
            <Circle size={14} />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${styles.statusBadge} ${styles.cancelled}`}>
            <XCircle size={14} />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className={`${styles.statusBadge} ${styles.completed}`}>
            <CheckCircle size={14} />
            Completed
          </span>
        );
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.default}`}>
            {status}
          </span>
        );
    }
  };

  // Render payment status badge
  const renderPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className={`${styles.paymentBadge} ${styles.paid}`}>
            <CheckCircle size={14} />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className={`${styles.paymentBadge} ${styles.paymentPending}`}>
            <Circle size={14} />
            Pending
          </span>
        );
      case 'refunded':
        return (
          <span className={`${styles.paymentBadge} ${styles.refunded}`}>
            <DollarSign size={14} />
            Refunded
          </span>
        );
      default:
        return (
          <span className={`${styles.paymentBadge} ${styles.default}`}>
            {status}
          </span>
        );
    }
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
        <p>Loading enrollments...</p>
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
          onClick={() => fetchEnrollments()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (enrollments.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Users size={48} className={styles.emptyIcon} />
        <h3>No Enrollments Found</h3>
        <p>There are no enrollments{selectedCourseId ? ' for this course' : ''} yet.</p>
        {selectedCourseId && (
          <button 
            className={styles.changeButton}
            onClick={() => setSelectedCourseId(null)}
          >
            View All Enrollments
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.enrollmentsContainer}>
      <div className={styles.enrollmentsHeader}>
        <div>
          <h2>Course Enrollments</h2>
          <p>View and manage student enrollments</p>
        </div>
        
        <button 
          className={styles.filterButton}
          onClick={handleToggleCourseFilter}
        >
          <Filter size={16} />
          {selectedCourseId ? 'Change Course' : 'Filter by Course'}
        </button>
      </div>
      
      {/* Course Filter Dropdown */}
      {showCourseFilter && (
        <div className={styles.courseFilterDropdown}>
          <button
            className={`${styles.courseOption} ${selectedCourseId === null ? styles.active : ''}`}
            onClick={() => handleSelectCourse(null)}
          >
            Show All Enrollments
          </button>
          
          {/* List of courses would come here - this would be dynamic in a real app */}
          <button
            className={`${styles.courseOption} ${selectedCourseId === 'course-001' ? styles.active : ''}`}
            onClick={() => handleSelectCourse('course-001')}
          >
            Cybersecurity Fundamentals
          </button>
          <button
            className={`${styles.courseOption} ${selectedCourseId === 'course-002' ? styles.active : ''}`}
            onClick={() => handleSelectCourse('course-002')}
          >
            Advanced Penetration Testing
          </button>
        </div>
      )}
      
      <motion.div 
        className={styles.enrollmentsTable}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Student</div>
          <div className={styles.headerCell}>Course</div>
          <div className={styles.headerCell}>Enrollment Date</div>
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Payment</div>
          <div className={styles.headerCell}>Actions</div>
        </div>
        
        <div className={styles.tableBody}>
          {enrollments.map((enrollment) => (
            <motion.div 
              key={enrollment.id} 
              className={styles.tableRow}
              variants={itemVariants}
            >
              <div className={styles.tableCell} data-label="Student">
                <div className={styles.studentInfo}>
                  <div className={styles.studentAvatar}>
                    {enrollment.author?.avatarUrl ? (
                      <img src={enrollment.author.avatarUrl} alt={enrollment.author.fullName} />
                    ) : (
                      <div className={styles.defaultAvatar}>
                        {enrollment.author?.fullName?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className={styles.studentDetails}>
                    <div className={styles.studentName}>{enrollment.author?.fullName || 'Unknown'}</div>
                    <div className={styles.studentContact}>
                      <Mail size={12} />
                      <span>{enrollment.author?.email || 'No email'}</span>
                    </div>
                    <div className={styles.studentContact}>
                      <Phone size={12} />
                      <span>{enrollment.author?.phone || 'No phone'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.tableCell} data-label="Course">
                <div className={styles.courseInfo}>
                  <div className={styles.courseTitle}>{enrollment.courseTitle}</div>
                </div>
              </div>
              
              <div className={styles.tableCell} data-label="Enrollment Date">
                <div className={styles.dateInfo}>
                  <Calendar size={14} />
                  <span>{formatDate(enrollment.enrollmentDate)}</span>
                </div>
                <div className={styles.timeInfo}>
                  <Clock size={14} />
                  <span>
                    {new Date(enrollment.enrollmentDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              
              <div className={styles.tableCell} data-label="Status">
                {renderStatusBadge(enrollment.status)}
              </div>
              
              <div className={styles.tableCell} data-label="Payment">
                <div className={styles.paymentInfo}>
                  {renderPaymentBadge(enrollment.paymentStatus)}
                  {enrollment.paymentAmount && (
                    <div className={styles.paymentAmount}>
                      <DollarSign size={14} />
                      <span>₹{enrollment.paymentAmount}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.tableCell} data-label="Actions">
                <div className={styles.actionButtons}>
                  <button className={styles.actionButton}>
                    View
                  </button>
                  <button className={styles.actionButton}>
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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