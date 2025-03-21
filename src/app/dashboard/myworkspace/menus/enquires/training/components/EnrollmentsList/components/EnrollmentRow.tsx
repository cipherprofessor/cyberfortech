// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/components/EnrollmentRow.tsx
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  XCircle, 
  DollarSign 
} from 'lucide-react';
import styles from '../components/EnrollmentsList/EnrollmentsList.module.scss';
import { Enrollment } from '../types';

interface EnrollmentRowProps {
  enrollment: Enrollment;
  onView: (enrollment: Enrollment) => void;
  onEdit: (enrollment: Enrollment) => void;
}

export function EnrollmentRow({ 
  enrollment, 
  onView, 
  onEdit 
}: EnrollmentRowProps) {
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
  
  // Get the first letter of the name for avatar
  const getNameInitial = () => {
    if (enrollment.author?.fullName) {
      return enrollment.author.fullName.charAt(0);
    } else if (enrollment.formData?.firstName) {
      return enrollment.formData.firstName.charAt(0);
    }
    return '?';
  };
  
  // Get the display name
  const getDisplayName = () => {
    if (enrollment.author?.fullName) {
      return enrollment.author.fullName;
    } else if (enrollment.formData?.firstName) {
      return `${enrollment.formData.firstName} ${enrollment.formData.lastName || ''}`.trim();
    }
    return 'Unknown';
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
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
                {getNameInitial()}
              </div>
            )}
          </div>
          <div className={styles.studentDetails}>
            <div className={styles.studentName}>{getDisplayName()}</div>
            <div className={styles.studentContact}>
              <Mail size={12} />
              <span>
                {enrollment.author?.email || enrollment.formData?.email || 'No email'}
              </span>
            </div>
            <div className={styles.studentContact}>
              <Phone size={12} />
              <span>
                {enrollment.author?.phone || enrollment.formData?.phone || 'No phone'}
              </span>
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
          <button 
            className={styles.actionButton}
            onClick={() => onView(enrollment)}
          >
            View
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => onEdit(enrollment)}
          >
            Edit
          </button>
        </div>
      </div>
    </motion.div>
  );
}