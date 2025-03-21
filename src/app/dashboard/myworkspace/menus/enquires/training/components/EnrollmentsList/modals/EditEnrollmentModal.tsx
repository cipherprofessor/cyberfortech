// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/modals/EditEnrollmentModal.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MessageSquare, 
  Save, 
  Loader
} from 'lucide-react';
import styles from './EnrollmentModals.module.scss';
import { Enrollment } from '../types';
import { updateEnrollment } from '@/services/enrollment-service';

interface EditEnrollmentModalProps {
  enrollment: Enrollment;
  onClose: () => void;
  onUpdate: (updatedEnrollment: Enrollment) => void;
}

export function EditEnrollmentModal({ 
  enrollment, 
  onClose, 
  onUpdate 
}: EditEnrollmentModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    status: enrollment.status,
    paymentStatus: enrollment.paymentStatus,
    firstName: enrollment.formData?.firstName || enrollment.author?.firstName || '',
    lastName: enrollment.formData?.lastName || enrollment.author?.lastName || '',
    email: enrollment.formData?.email || enrollment.author?.email || '',
    phone: enrollment.formData?.phone || enrollment.author?.phone || '',
    company: enrollment.formData?.company || '',
    comments: enrollment.formData?.comments || ''
  });

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for the API
      const updatedData = {
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        metadata: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          comments: formData.comments
        }
      };
      
      // Call the API to update the enrollment
      const updatedEnrollment = await updateEnrollment(enrollment.id, updatedData);
      
      // Call the onUpdate callback with the updated enrollment
      onUpdate({
        ...enrollment,
        status: formData.status as any,
        paymentStatus: formData.paymentStatus as any,
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          comments: formData.comments
        }
      });
      
      // Close the modal
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update enrollment';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
              Edit Enrollment
            </h3>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.modalContent}>
              {error && (
                <div className={styles.errorAlert}>
                  <p>{error}</p>
                </div>
              )}
              
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>Enrollment Status</h4>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="status" className={styles.formLabel}>
                      Enrollment Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      disabled={isSubmitting}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="paymentStatus" className={styles.formLabel}>
                      Payment Status
                    </label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      disabled={isSubmitting}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>Student Information</h4>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.formLabel}>
                      First Name
                    </label>
                    <div className={styles.inputWithIcon}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.formLabel}>
                      Last Name
                    </label>
                    <div className={styles.inputWithIcon}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>
                      Email
                    </label>
                    <div className={styles.inputWithIcon}>
                      <Mail size={16} className={styles.inputIcon} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>
                      Phone
                    </label>
                    <div className={styles.inputWithIcon}>
                      <Phone size={16} className={styles.inputIcon} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.formLabel}>
                    Company
                  </label>
                  <div className={styles.inputWithIcon}>
                    <Building size={16} className={styles.inputIcon} />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="comments" className={styles.formLabel}>
                    Additional Comments
                  </label>
                  <div className={styles.textareaWithIcon}>
                    <MessageSquare size={16} className={styles.textareaIcon} />
                    <textarea
                      id="comments"
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className={styles.loadingSpinner} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default EditEnrollmentModal;