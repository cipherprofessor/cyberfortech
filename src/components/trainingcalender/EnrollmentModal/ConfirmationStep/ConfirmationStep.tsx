// src/components/trainingcalender/EnrollmentModal/ConfirmationStep.tsx
"use client"
import { CheckCircle2 } from 'lucide-react';
import styles from './ConfirmationStep.module.scss';
import { EnrollmentFormData, TrainingCourse } from '../types';

interface ConfirmationStepProps {
  formData: EnrollmentFormData;
  course: TrainingCourse;
  enrollmentId: string;
  onClose: () => void;
  isProcessing: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  course,
  enrollmentId,
  onClose,
  isProcessing
}) => {
  // Format payment method for display
  const formatPaymentMethod = (method: string): string => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'invoice':
        return 'Invoice';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.confirmationContent}>
        <div className={styles.successIcon}>
          <CheckCircle2 size={48} />
        </div>
        
        <h4 className={styles.confirmationTitle}>Enrollment Successful!</h4>
        
        <p className={styles.confirmationMessage}>
          Thank you for enrolling in <span className={styles.courseName}>{course.title}</span>.
          We've sent a confirmation email to <span className={styles.userEmail}>{formData.email}</span> with
          all the details about your course.
        </p>
        
        <div className={styles.enrollmentDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Enrollment ID:</span>
            <span className={styles.detailValue}>{enrollmentId}</span>
          </div>
          

          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Amount:</span>
            <span className={styles.detailValue}>₹{course.price}</span>
          </div>
        </div>
        
        <div className={styles.nextSteps}>
          <h5 className={styles.nextStepsTitle}>Next Steps:</h5>
          <ol className={styles.stepsList}>
            <li className={styles.step}>Check your email for enrollment confirmation</li>
            <li className={styles.step}>Complete the payment process (if applicable)</li>
            <li className={styles.step}>You'll receive course materials and access instructions before the start date</li>
          </ol>
        </div>
        
        <button
          className={styles.doneButton}
          onClick={onClose}
          disabled={isProcessing}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;