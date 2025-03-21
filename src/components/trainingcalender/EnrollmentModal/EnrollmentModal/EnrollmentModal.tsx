"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './EnrollmentModal.module.scss';
import { TrainingCourse } from '@/app/(routes)/trainingcalender/traininghooks';

import ConfirmationStep from '../ConfirmationStep/ConfirmationStep';
import CourseDetailsStep from '../CourseDetailsStep/CourseDetailsStep';
import RegistrationFormStep from '../RegistrationFormStep/RegistrationFormStep';
import { EnrollmentFormData, EnrollmentStep } from '../types';

// Import step components


// Import types

interface EnrollmentModalProps {
  course: TrainingCourse;
  onClose: () => void;
  onSubmit: (formData: EnrollmentFormData) => void;
  isProcessing?: boolean;
  enrollmentId?: string;
}

export function EnrollmentModal({ 
  course, 
  onClose, 
  onSubmit,
  isProcessing = false,
  enrollmentId
}: EnrollmentModalProps) {
  // Current step in the enrollment process
  const [step, setStep] = useState<EnrollmentStep>(
    enrollmentId ? EnrollmentStep.CONFIRMATION : EnrollmentStep.DETAILS
  );
  
  // Form data state
  const [formData, setFormData] = useState<EnrollmentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    comments: '',
    agreeTerms: false,
    courseId: course.id
  });
  
  // Generated enrollment ID
  const [generatedEnrollmentId, setGeneratedEnrollmentId] = useState<string>(
    enrollmentId || `ENR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  );

  // Handle step change
  const handleStepChange = (newStep: EnrollmentStep) => {
    setStep(newStep);
  };

  // Handle form data change
  const handleFormChange = (data: EnrollmentFormData) => {
    setFormData(data);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      setStep(EnrollmentStep.CONFIRMATION);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Get step title based on current step
  const getStepTitle = (): string => {
    switch (step) {
      case EnrollmentStep.DETAILS:
        return 'Course Enrollment';
      case EnrollmentStep.FORM:
        return 'Complete Registration';
      case EnrollmentStep.CONFIRMATION:
        return 'Enrollment Successful';
      default:
        return 'Course Enrollment';
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className={styles.modalContainer}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{getStepTitle()}</h3>
            <button className={styles.closeButton} onClick={onClose} disabled={isProcessing}>
              <X size={20} />
            </button>
          </div>
          
          {/* Render the appropriate step component based on current step */}
          {step === EnrollmentStep.DETAILS && (
            <CourseDetailsStep 
              course={course} 
              onStepChange={handleStepChange} 
              isProcessing={isProcessing} 
            />
          )}
          
          {step === EnrollmentStep.FORM && (
            <RegistrationFormStep 
              formData={formData}
              onFormChange={handleFormChange}
              onStepChange={handleStepChange}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
            />
          )}
          
          {step === EnrollmentStep.CONFIRMATION && (
            <ConfirmationStep 
              formData={formData}
              course={course}
              enrollmentId={generatedEnrollmentId}
              onClose={onClose}
              isProcessing={isProcessing}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EnrollmentModal;