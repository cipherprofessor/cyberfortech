// src/app/dashboard/myworkspace/menus/enquires/training/components/EditCourseModal/EditCourseModal.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import styles from './EditCourseModal.module.scss';

import { 
  updateCourse, 
  Course, 
  CourseUpdateData 
} from '@/services/course-service';

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCourseModal({ 
  course, 
  onClose, 
  onSuccess 
}: EditCourseModalProps) {
  // Initialize form data from the course
  const [formData, setFormData] = useState<CourseUpdateData>({
    title: course.title,
    description: course.description,
    dates: course.dates,
    time: course.time,
    duration: course.duration,
    mode: course.mode,
    location: course.location,
    instructor: course.instructor,
    maxCapacity: course.maxCapacity,
    price: course.price,
    level: course.level,
    category: course.category,
    prerequisites: course.prerequisites,
    certification: course.certification,
    language: course.language,
    isActive: course.isActive
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox for isActive
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
      return;
    }
    
    // Handle numeric inputs
    if (name === 'maxCapacity' || name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.dates?.trim()) {
      newErrors.dates = 'Dates are required';
    }
    
    if (!formData.time?.trim()) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.duration?.trim()) {
      newErrors.duration = 'Duration is required';
    }
    
    if (!formData.instructor?.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    
    if (formData.maxCapacity !== undefined && formData.maxCapacity < course.currentEnrollment) {
      newErrors.maxCapacity = `Maximum capacity cannot be less than current enrollment (${course.currentEnrollment})`;
    }
    
    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateCourse(course.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
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
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h2>Edit Course</h2>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>
          
          <form className={styles.modalForm} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Basic Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Basic Information</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="title">
                    Course Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? styles.inputError : ''}
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      {errors.title}
                    </div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="description">
                    Description <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={errors.description ? styles.inputError : ''}
                    rows={4}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      {errors.description}
                    </div>
                  )}
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="category">
                      Category <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={errors.category ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.category && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.category}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="level">
                      Level <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className={errors.level ? styles.inputError : ''}
                      disabled={isLoading}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {errors.level && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.level}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="isActive" className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span>Active Course</span>
                  </label>
                  <div className={styles.checkboxHelp}>
                    Inactive courses won't appear in the public course list
                  </div>
                </div>
              </div>
              
              {/* Schedule Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Schedule & Location</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="dates">
                      Course Dates <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="dates"
                      name="dates"
                      value={formData.dates}
                      onChange={handleInputChange}
                      className={errors.dates ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.dates && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.dates}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="time">
                      Course Time <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={errors.time ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.time && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.time}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="duration">
                      Duration <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className={errors.duration ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.duration && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="mode">
                      Mode <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="mode"
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className={errors.mode ? styles.inputError : ''}
                      disabled={isLoading}
                    >
                      <option value="online">Online</option>
                      <option value="in-person">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {errors.mode && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.mode}
                      </div>
                    )}
                  </div>
                </div>
                
                {(formData.mode === 'in-person' || formData.mode === 'hybrid') && (
                  <div className={styles.formGroup}>
                    <label htmlFor="location">
                      Location <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      className={errors.location ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.location && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.location}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Details Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Additional Details</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="instructor">
                      Instructor <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className={errors.instructor ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.instructor && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.instructor}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="language">
                      Language <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className={errors.language ? styles.inputError : ''}
                      disabled={isLoading}
                    />
                    {errors.language && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.language}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="maxCapacity">
                      Maximum Capacity <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      id="maxCapacity"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      className={errors.maxCapacity ? styles.inputError : ''}
                      min={course.currentEnrollment}
                      disabled={isLoading}
                    />
                    {errors.maxCapacity && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.maxCapacity}
                      </div>
                    )}
                    <div className={styles.helpText}>
                      Current enrollment: {course.currentEnrollment}
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="price">
                      Price (₹) <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={errors.price ? styles.inputError : ''}
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                    {errors.price && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.price}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="certification">
                    Certification
                  </label>
                  <input
                    type="text"
                    id="certification"
                    name="certification"
                    value={formData.certification || ''}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className={styles.loadingSpinner} />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}