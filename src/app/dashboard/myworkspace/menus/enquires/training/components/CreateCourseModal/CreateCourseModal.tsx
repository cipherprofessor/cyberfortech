// src/app/dashboard/myworkspace/menus/enquires/training/components/CreateCourseModal/CreateCourseModal.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Loader2, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Tag, 
  Users, 
  DollarSign,
  Globe,
  Monitor,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';
import styles from './CreateCourseModal.module.scss';

import { createCourse, CourseCreateData, getCategories } from '@/services/course-service';

interface CreateCourseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCourseModal({ onClose, onSuccess }: CreateCourseModalProps) {
  const [formData, setFormData] = useState<CourseCreateData>({
    title: '',
    description: '',
    dates: '',
    time: '',
    duration: '',
    mode: 'online',
    instructor: '',
    maxCapacity: 20,
    price: 0,
    level: 'beginner',
    category: '',
    prerequisites: [],
    language: 'English'
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoryNames = response.categories.map(category => category.name);
        setCategories(categoryNames);
        
        // Set default category if available
        if (categoryNames.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: categoryNames[0] }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
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

  // Add prerequisite
  const handleAddPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), prerequisiteInput.trim()]
      }));
      setPrerequisiteInput('');
    }
  };

  // Remove prerequisite
  const handleRemovePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter((_, i) => i !== index)
    }));
  };

  // Validate form for current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      
      if (!formData.level) {
        newErrors.level = 'Level is required';
      }
    }
    
    if (step === 2) {
      if (!formData.dates.trim()) {
        newErrors.dates = 'Dates are required';
      }
      
      if (!formData.time.trim()) {
        newErrors.time = 'Time is required';
      }
      
      if (!formData.duration.trim()) {
        newErrors.duration = 'Duration is required';
      }
      
      if (!formData.mode) {
        newErrors.mode = 'Mode is required';
      }
      
      if (formData.mode === 'in-person' && !formData.location) {
        newErrors.location = 'Location is required for in-person courses';
      }
    }
    
    if (step === 3) {
      if (!formData.instructor.trim()) {
        newErrors.instructor = 'Instructor name is required';
      }
      
      if (formData.maxCapacity <= 0) {
        newErrors.maxCapacity = 'Maximum capacity must be greater than 0';
      }
      
      if (formData.price < 0) {
        newErrors.price = 'Price cannot be negative';
      }
      
      if (!formData.language.trim()) {
        newErrors.language = 'Language is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createCourse(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
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
            <h2>Create New Course</h2>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.stepIndicator}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`${styles.step} ${step > index ? styles.completed : ''} ${step === index + 1 ? styles.active : ''}`}
              >
                <div className={styles.stepCircle}>{index + 1}</div>
                <div className={styles.stepLabel}>
                  {index === 0 && 'Basic Info'}
                  {index === 1 && 'Schedule'}
                  {index === 2 && 'Details'}
                </div>
              </div>
            ))}
          </div>
          
          <form className={styles.modalForm} onSubmit={handleSubmit}>
            {/* Step 1: Basic Course Information */}
            {step === 1 && (
              <div className={styles.formStep}>
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
                    placeholder="Enter course title"
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
                    placeholder="Enter course description"
                    rows={4}
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
                    <div className={styles.selectWrapper}>
                      <Tag size={16} className={styles.inputIcon} />
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={errors.category ? styles.inputError : ''}
                        disabled={isCategoriesLoading}
                      >
                        <option value="" disabled>Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
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
                    <div className={styles.selectWrapper}>
                      <GraduationCap size={16} className={styles.inputIcon} />
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className={errors.level ? styles.inputError : ''}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    {errors.level && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.level}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Course Schedule */}
            {step === 2 && (
              <div className={styles.formStep}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="dates">
                      Course Dates <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWithIcon}>
                      <Calendar size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="dates"
                        name="dates"
                        value={formData.dates}
                        onChange={handleInputChange}
                        className={errors.dates ? styles.inputError : ''}
                        placeholder="e.g., Jan 15 - Feb 28, 2025"
                      />
                    </div>
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
                    <div className={styles.inputWithIcon}>
                      <Clock size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className={errors.time ? styles.inputError : ''}
                        placeholder="e.g., 18:00 - 20:00 IST"
                      />
                    </div>
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
                      placeholder="e.g., 4 weeks, 6 sessions"
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
                    <div className={styles.selectWrapper}>
                      <Monitor size={16} className={styles.inputIcon} />
                      <select
                        id="mode"
                        name="mode"
                        value={formData.mode}
                        onChange={handleInputChange}
                        className={errors.mode ? styles.inputError : ''}
                      >
                        <option value="online">Online</option>
                        <option value="in-person">In-Person</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
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
                    <div className={styles.inputWithIcon}>
                      <MapPin size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        className={errors.location ? styles.inputError : ''}
                        placeholder="Enter venue location"
                      />
                    </div>
                    {errors.location && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.location}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className={styles.formStep}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="instructor">
                      Instructor <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWithIcon}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="instructor"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className={errors.instructor ? styles.inputError : ''}
                        placeholder="Enter instructor name"
                      />
                    </div>
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
                    <div className={styles.inputWithIcon}>
                      <Globe size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className={errors.language ? styles.inputError : ''}
                        placeholder="e.g., English, Hindi"
                      />
                    </div>
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
                    <div className={styles.inputWithIcon}>
                      <Users size={16} className={styles.inputIcon} />
                      <input
                        type="number"
                        id="maxCapacity"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleInputChange}
                        className={errors.maxCapacity ? styles.inputError : ''}
                        min="1"
                        placeholder="Enter maximum number of students"
                      />
                    </div>
                    {errors.maxCapacity && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.maxCapacity}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="price">
                      Price (₹) <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWithIcon}>
                      <DollarSign size={16} className={styles.inputIcon} />
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={errors.price ? styles.inputError : ''}
                        min="0"
                        step="0.01"
                        placeholder="Enter course price"
                      />
                    </div>
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
                    Certification (Optional)
                  </label>
                  <input
                    type="text"
                    id="certification"
                    name="certification"
                    value={formData.certification || ''}
                    onChange={handleInputChange}
                    placeholder="Enter certification details, if any"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Prerequisites (Optional)</label>
                  <div className={styles.prerequisitesInput}>
                    <input
                      type="text"
                      value={prerequisiteInput}
                      onChange={(e) => setPrerequisiteInput(e.target.value)}
                      placeholder="Add a prerequisite"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPrerequisite();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddPrerequisite}
                      className={styles.addPrerequisiteButton}
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.prerequisites && formData.prerequisites.length > 0 && (
                    <div className={styles.prerequisitesList}>
                      {formData.prerequisites.map((prerequisite, index) => (
                        <div key={index} className={styles.prerequisiteTag}>
                          <span>{prerequisite}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePrerequisite(index)}
                            className={styles.removePrerequisite}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className={styles.formActions}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={handlePrevStep}
                  disabled={isLoading}
                >
                  Back
                </button>
              )}
              
              {step < totalSteps ? (
                <button
                  type="button"
                  className={styles.nextButton}
                  onClick={handleNextStep}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className={styles.loadingSpinner} />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}