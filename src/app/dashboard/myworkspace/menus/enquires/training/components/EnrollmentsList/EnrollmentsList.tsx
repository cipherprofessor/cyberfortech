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
  Phone
} from 'lucide-react';
import styles from './EnrollmentsList.module.scss';

import {  CourseFilters } from '@/services/course-service';
import { getCourseEnrollments } from '@/services/enrollment-service';

interface EnrollmentsListProps {
  filters: CourseFilters;
}

export default function EnrollmentsList({ filters }: EnrollmentsListProps) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch enrollments
  useEffect(() => {
    // If courseId is not provided, don't fetch enrollments yet
    if (!courseId) {
      setIsLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getCourseEnrollments(
          courseId, 
          pagination.page, 
          pagination.limit
        );
        setEnrollments(response.enrollments);
        setPagination(response.pagination);
      } catch (err) {
        setError('Failed to fetch enrollments. Please try again.');
        console.error('Error fetching enrollments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [courseId, pagination.page, pagination.limit]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
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

  // Format date
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
        <p>Loading enrollments...</p>
      </div>
    );
  }

  // No course selected yet
  if (!courseId) {
    return (
      <div className={styles.enrollmentsContainer}>
        <div className={styles.enrollmentsHeader}>
          <h2>Course Enrollments</h2>
          <p>Select a course to view its enrollments</p>
        </div>
        
        <div className={styles.courseSelector}>
          <label htmlFor="courseSelect">Select Course</label>
          <select 
            id="courseSelect"
            value={courseId || ''}
            onChange={(e) => setCourseId(e.target.value)}
            className={styles.courseSelect}
          >
            <option value="" disabled>Select a course</option>
            {/* Placeholder for course options - would be fetched from API */}
            <option value="course-001">Cybersecurity Fundamentals</option>
            <option value="course-002">Advanced Penetration Testing</option>
            <option value="course-003">Cloud Security Architecture</option>
          </select>
        </div>
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
  if (enrollments.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Users size={48} className={styles.emptyIcon} />
        <h3>No Enrollments Found</h3>
        <p>There are no enrollments for this course yet.</p>
        <button 
          className={styles.changeButton}
          onClick={() => setCourseId(null)}
        >
          Select Another Course
        </button>
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
          className={styles.changeCourseButton}
          onClick={() => setCourseId(null)}
        >
          Change Course
        </button>
      </div>
      
      <motion.div 
        className={styles.enrollmentsTable}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Student</div>
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
              <div className={styles.tableCell}>
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
              
              <div className={styles.tableCell}>
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
              
              <div className={styles.tableCell}>
                {renderStatusBadge(enrollment.status)}
              </div>
              
              <div className={styles.tableCell}>
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
              
              <div className={styles.tableCell}>
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