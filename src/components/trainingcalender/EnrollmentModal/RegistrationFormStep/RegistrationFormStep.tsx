// src/components/trainingcalender/EnrollmentModal/RegistrationFormStep.tsx
"use client"
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, CreditCard, FileText as File, Loader2 } from 'lucide-react';
import styles from './RegistrationFormStep.module.scss';
import { EnrollmentFormData, EnrollmentStep, FormErrors } from '../types';



interface RegistrationFormStepProps {
  formData: EnrollmentFormData;
  onFormChange: (data: EnrollmentFormData) => void;
  onStepChange: (step: EnrollmentStep) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export const RegistrationFormStep: React.FC<RegistrationFormStepProps> = ({
  formData,
  onFormChange,
  onStepChange,
  onSubmit,
  isProcessing
}) => {
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      onFormChange({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      onFormChange({
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
    const newErrors: FormErrors = {};
    
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
      onSubmit();
    }
  };

  return (
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
                disabled={isProcessing}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
              disabled={isProcessing}
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
                disabled={isProcessing}
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
              onClick={() => onStepChange(EnrollmentStep.DETAILS)}
              disabled={isProcessing}
            >
              Back
            </button>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className={styles.spinIcon} />
                  Processing...
                </>
              ) : (
                'Complete Enrollment'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationFormStep;