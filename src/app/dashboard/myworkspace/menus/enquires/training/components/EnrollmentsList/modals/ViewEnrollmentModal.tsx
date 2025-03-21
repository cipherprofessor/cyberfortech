// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/modals/ViewEnrollmentModal.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle, 
  XCircle, 
  Circle, 
  DollarSign, 
  MessageSquare, 
  Star, 
  FileText
} from 'lucide-react';
import styles from './EnrollmentModals.module.scss';
import { Enrollment } from '../types';

interface ViewEnrollmentModalProps {
  enrollment: Enrollment;
  onClose: () => void;
}

export function ViewEnrollmentModal({ enrollment, onClose }: ViewEnrollmentModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'student' | 'payment'>('details');

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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

  // Render payment badge
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

  // Get student name
  const getStudentName = () => {
    if (enrollment.author?.fullName) {
      return enrollment.author.fullName;
    } else if (enrollment.formData?.firstName) {
      return `${enrollment.formData.firstName} ${enrollment.formData.lastName || ''}`.trim();
    }
    return 'Unknown';
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay}>
        <motion.div 
          className={styles.modalContainer}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>
              Enrollment Details
            </h3>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.modalTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Course Details
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'student' ? styles.active : ''}`}
              onClick={() => setActiveTab('student')}
            >
              Student Information
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'payment' ? styles.active : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              Payment & Status
            </button>
          </div>
          
          <div className={styles.modalContent}>
            {/* Course Details Tab */}
            {activeTab === 'details' && (
              <div className={styles.tabContent}>
                <div className={styles.courseHeader}>
                  <h4 className={styles.courseTitle}>{enrollment.courseTitle}</h4>
                  <span className={`${styles.levelBadge} ${styles[enrollment.courseLevel]}`}>
                    {enrollment.courseLevel}
                  </span>
                </div>
                
                <p className={styles.courseDescription}>{enrollment.courseDescription}</p>
                
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Dates:</span>
                    <span className={styles.detailValue}>
                      <Calendar size={16} />
                      {enrollment.courseDates}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time:</span>
                    <span className={styles.detailValue}>
                      <Clock size={16} />
                      {enrollment.courseTime}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Duration:</span>
                    <span className={styles.detailValue}>
                      {enrollment.courseDuration}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Mode:</span>
                    <span className={styles.detailValue}>{enrollment.courseMode}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Instructor:</span>
                    <span className={styles.detailValue}>{enrollment.courseInstructor}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Category:</span>
                    <span className={styles.detailValue}>{enrollment.courseCategory}</span>
                  </div>
                </div>
                
                <div className={styles.enrollmentDates}>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Enrollment Date:</span>
                    <span className={styles.dateValue}>
                      {formatDate(enrollment.enrollmentDate)}
                    </span>
                  </div>
                  
                  {enrollment.completionDate && (
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Completion Date:</span>
                      <span className={styles.dateValue}>
                        {formatDate(enrollment.completionDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Student Information Tab */}
            {activeTab === 'student' && (
              <div className={styles.tabContent}>
                <div className={styles.studentProfile}>
                  <div className={styles.studentAvatar}>
                    {enrollment.author?.avatarUrl ? (
                      <img src={enrollment.author.avatarUrl} alt={enrollment.author.fullName} />
                    ) : (
                      <div className={styles.defaultAvatar}>
                        {getStudentName().charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <h4 className={styles.studentName}>{getStudentName()}</h4>
                </div>
                
                <div className={styles.studentInfoGrid}>
                  <div className={styles.studentInfoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>
                      <Mail size={16} />
                      {enrollment.author?.email || enrollment.formData?.email || 'Not provided'}
                    </span>
                  </div>
                  
                  <div className={styles.studentInfoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>
                      <Phone size={16} />
                      {enrollment.author?.phone || enrollment.formData?.phone || 'Not provided'}
                    </span>
                  </div>
                  
                  {enrollment.formData?.company && (
                    <div className={styles.studentInfoItem}>
                      <span className={styles.infoLabel}>Company:</span>
                      <span className={styles.infoValue}>
                        <Building size={16} />
                        {enrollment.formData.company}
                      </span>
                    </div>
                  )}
                </div>
                
                {enrollment.formData?.comments && (
                  <div className={styles.commentsSection}>
                    <h5 className={styles.commentsSectionTitle}>
                      <MessageSquare size={16} />
                      Additional Comments
                    </h5>
                    <div className={styles.commentsBox}>
                      {enrollment.formData.comments}
                    </div>
                  </div>
                )}
                
                {enrollment.feedback && (
                  <div className={styles.feedbackSection}>
                    <h5 className={styles.feedbackSectionTitle}>
                      <FileText size={16} />
                      Student Feedback
                    </h5>
                    <div className={styles.feedbackBox}>
                      {enrollment.feedback}
                    </div>
                    
                    {enrollment.rating && (
                      <div className={styles.ratingDisplay}>
                        <span className={styles.ratingLabel}>Rating:</span>
                        <div className={styles.ratingStars}>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < enrollment.rating! ? styles.starFilled : styles.starEmpty} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Payment & Status Tab */}
            {activeTab === 'payment' && (
              <div className={styles.tabContent}>
                <div className={styles.statusSection}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Enrollment Status:</span>
                    <span className={styles.statusValue}>
                      {renderStatusBadge(enrollment.status)}
                    </span>
                  </div>
                  
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Payment Status:</span>
                    <span className={styles.statusValue}>
                      {renderPaymentBadge(enrollment.paymentStatus)}
                    </span>
                  </div>
                  
                  {enrollment.paymentId && (
                    <div className={styles.statusItem}>
                      <span className={styles.statusLabel}>Payment ID:</span>
                      <span className={styles.statusValue}>
                        {enrollment.paymentId}
                      </span>
                    </div>
                  )}
                  
                  {enrollment.paymentAmount && (
                    <div className={styles.statusItem}>
                      <span className={styles.statusLabel}>Payment Amount:</span>
                      <span className={styles.statusValue}>
                        <DollarSign size={16} />
                        ₹{enrollment.paymentAmount}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={styles.timelineSection}>
                  <h5 className={styles.timelineTitle}>Enrollment Timeline</h5>
                  
                  <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineIcon}>
                        <Circle size={16} className={styles.iconCompleted} />
                      </div>
                      <div className={styles.timelineContent}>
                        <span className={styles.timelineEvent}>Enrollment Created</span>
                        <span className={styles.timelineDate}>
                          {formatDate(enrollment.enrollmentDate)} at {formatTime(enrollment.enrollmentDate)}
                        </span>
                      </div>
                    </div>
                    
                    {enrollment.status === 'confirmed' && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineIcon}>
                          <Circle size={16} className={styles.iconCompleted} />
                        </div>
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineEvent}>Enrollment Confirmed</span>
                          <span className={styles.timelineDate}>
                            {/* Would need updated_at data for confirmation date */}
                            After payment verification
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {enrollment.status === 'cancelled' && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineIcon}>
                          <Circle size={16} className={styles.iconCancelled} />
                        </div>
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineEvent}>Enrollment Cancelled</span>
                          <span className={styles.timelineDate}>
                            {/* Would need cancelled_at data */}
                            Course enrollment was cancelled
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {enrollment.status === 'completed' && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineIcon}>
                          <Circle size={16} className={styles.iconCompleted} />
                        </div>
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineEvent}>Course Completed</span>
                          <span className={styles.timelineDate}>
                            {formatDate(enrollment.completionDate || '')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.modalFooter}>
            <button className={styles.closeModalButton} onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ViewEnrollmentModal;