"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  BadgeCheck, 
  ChevronRight,
  Building,
  Mail,
  Phone,
  User,
  CheckCircle2,
  FileText as File
} from 'lucide-react';
import styles from './EnrollmentModal.module.scss';

// Interface for training course data
interface TrainingCourse {
  id: string;
  title: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor: string;
  availability: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  prerequisites?: string[];
  certification?: string;
  language: string;
}

// Interface for enrollment form data
interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  paymentMethod: 'credit_card' | 'invoice' | 'bank_transfer';
  comments: string;
  agreeTerms: boolean;
}

interface EnrollmentModalProps {
  course: TrainingCourse;
  onClose: () => void;
  onSubmit: (formData: EnrollmentFormData) => void;
}

export function EnrollmentModal({ 
  course, 
  onClose, 
  onSubmit 
}: EnrollmentModalProps) {
  const [step, setStep] = useState<'details' | 'form' | 'confirmation'>('details');
  const [formData, setFormData] = useState<EnrollmentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    paymentMethod: 'credit_card',
    comments: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentFormData, string>>>({});

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name as keyof EnrollmentFormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: Partial<Record<keyof EnrollmentFormData, string>> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setStep('confirmation');
    }
  };

  // Function to get level badge style
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return styles.beginnerBadge;
      case 'intermediate':
        return styles.intermediateBadge;
      case 'advanced':
        return styles.advancedBadge;
      default:
        return '';
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
            <h3 className={styles.modalTitle}>
              {step === 'details' && 'Course Enrollment'}
              {step === 'form' && 'Complete Registration'}
              {step === 'confirmation' && 'Enrollment Successful'}
            </h3>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          {step === 'details' && (
            <div className={styles.modalContent}>
              <div className={styles.courseOverview}>
                <div className={styles.courseHeader}>
                  <h4 className={styles.courseTitle}>{course.title}</h4>
                  <span className={`${styles.courseBadge} ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                <p className={styles.courseDescription}>{course.description}</p>
                
                <div className={styles.courseInfoGrid}>
                  <div className={styles.infoItem}>
                    <Calendar size={16} />
                    <span className={styles.infoLabel}>Dates:</span>
                    <span className={styles.infoValue}>{course.dates}</span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <Clock size={16} />
                    <span className={styles.infoLabel}>Time:</span>
                    <span className={styles.infoValue}>{course.time}</span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <Users size={16} />
                    <span className={styles.infoLabel}>Availability:</span>
                    <span className={styles.infoValue}>{course.availability} seats left</span>
                  </div>
                  
                  {course.certification && (
                    <div className={styles.infoItem}>
                      <BadgeCheck size={16} />
                      <span className={styles.infoLabel}>Certification:</span>
                      <span className={styles.infoValue}>{course.certification}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.pricingSection}>
                  <div className={styles.priceTag}>
                    <span className={styles.priceLabel}>Course Fee:</span>
                    <span className={styles.priceAmount}>
                      <span className={styles.priceCurrency}>₹</span>
                      {course.price}
                    </span>
                  </div>
                  
                  <button 
                    className={styles.proceedButton}
                    onClick={() => setStep('form')}
                  >
                    Proceed to Registration
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {step === 'form' && (
            <div className={styles.modalContent}>
              <form className={styles.enrollmentForm} onSubmit={handleSubmit}>
                <div className={styles.formSection}>
                  <h4 className={styles.sectionTitle}>Personal Information</h4>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName" className={styles.formLabel}>
                        First Name <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWithIcon}>
                        <User size={16} className={styles.inputIcon} />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${errors.firstName ? styles.inputError : ''}`}
                          placeholder="Enter your first name"
                        />
                      </div>
                      {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName" className={styles.formLabel}>
                        Last Name <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWithIcon}>
                        <User size={16} className={styles.inputIcon} />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${errors.lastName ? styles.inputError : ''}`}
                          placeholder="Enter your last name"
                        />
                      </div>
                      {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>
                        Email <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWithIcon}>
                        <Mail size={16} className={styles.inputIcon} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="phone" className={styles.formLabel}>
                        Phone <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWithIcon}>
                        <Phone size={16} className={styles.inputIcon} />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="company" className={styles.formLabel}>
                      Company/Organization
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
                        placeholder="Enter your company name (optional)"
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formSection}>
                  <h4 className={styles.sectionTitle}>Payment Information</h4>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Payment Method <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.paymentMethods}>
                      <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'credit_card' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioControl}>
                          <CreditCard size={18} />
                          Credit Card
                        </span>
                      </label>
                      
                      <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'invoice' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="invoice"
                          checked={formData.paymentMethod === 'invoice'}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioControl}>
                          <File size={18} />
                          Invoice
                        </span>
                      </label>
                      
                      <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'bank_transfer' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === 'bank_transfer'}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioControl}>
                          <Building size={18} />
                          Bank Transfer
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="comments" className={styles.formLabel}>
                      Additional Comments
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <div className={styles.termsGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>
                        I agree to the <a href="#" className={styles.termsLink}>Terms & Conditions</a> and <a href="#" className={styles.termsLink}>Privacy Policy</a>
                      </span>
                    </label>
                    {errors.agreeTerms && <span className={styles.errorMessage}>{errors.agreeTerms}</span>}
                  </div>
                  
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      className={styles.backButton}
                      onClick={() => setStep('details')}
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      className={styles.submitButton}
                    >
                      Complete Enrollment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {step === 'confirmation' && (
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
                    <span className={styles.detailValue}>ENR-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Payment Method:</span>
                    <span className={styles.detailValue}>
                      {formData.paymentMethod === 'credit_card' && 'Credit Card'}
                      {formData.paymentMethod === 'invoice' && 'Invoice'}
                      {formData.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                    </span>
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
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EnrollmentModal;