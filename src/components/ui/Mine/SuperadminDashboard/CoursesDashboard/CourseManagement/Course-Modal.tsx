// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseModal.tsx
//Alpha Centauri
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, GraduationCap } from 'lucide-react';
import axios from 'axios';

import { Course, CourseModalProps, Instructor } from '@/types/courses';
import { useTheme } from 'next-themes';
import styles from './CourseModal.module.scss';
import { SuccessAlert, ErrorAlert } from '../../../Alert/Alert';

import { FormFields } from './components/FormFields/FormFields';
import { InstructorSelect } from './components/InstructorSelect/InstructorSelect';
import { ImageUpload } from './components/ImageUpload/ImageUpload';

export function CourseModal({
  isOpen,
  onClose,
  mode,
  course,
  onSubmit
}: CourseModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Beginner',
    category: '',
    image_url: '',
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData(course);
      setImagePreview(course.image_url || null);
      setSelectedInstructorId(course.instructor_id || null);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'Beginner',
        category: '',
        image_url: '',
      });
      setImagePreview(null);
      setSelectedInstructorId(null);
    }
  }, [course, mode, isOpen]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('/api/users/instructors');
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        showAlert('error', 'Failed to fetch instructors');
      }
    };
  
    fetchInstructors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instructor_id) {
      showAlert('error', 'Please select an instructor');
      return;
    }
    setLoading(true);
    
    try {
      await onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to save course');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showAlert('error', 'Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      showAlert('error', 'Failed to upload image');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.overlay} ${isDark ? styles.dark : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {showSuccess && (
            <SuccessAlert
              message={`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`}
            />
          )}
          {showError && (
            <ErrorAlert
              message={errorMessage}
            />
          )}

          <div className={styles.modalHeader}>
            <div className={styles.headerContent}>
              <GraduationCap size={24} className={styles.headerIcon} />
              <h2>{mode === 'create' ? 'Create New Course' : 'Edit Course'}</h2>
            </div>
            <button 
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <FormFields 
            formData={formData} 
            setFormData={setFormData} 
          />
          
          <InstructorSelect 
            instructors={instructors}
            selectedInstructor={selectedInstructorId}
            setSelectedInstructor={(id: string) => {
              setSelectedInstructorId(id);
              setFormData(prev => ({
                ...prev,
                instructor_id: id
              }));
            }}
            setFormData={setFormData}
            courseInstructorId={course?.instructor_id}
          />
              
              <ImageUpload 
                imagePreview={imagePreview}
                isFileUpload={isFileUpload}
                formData={formData}
                setFormData={setFormData}
                setImagePreview={setImagePreview}
                showAlert={showAlert}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                setIsFileUpload={setIsFileUpload}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{mode === 'create' ? 'Create Course' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}