'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

import { Course, Instructor } from '@/types/courses';
import { useTheme } from 'next-themes';
import styles from './CourseCreatePage.module.scss';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Mine/Alert/Alert';
import { CourseInstructorSelect } from '../components/InstructorSelect/InstructorSelect';
import { CourseBasicInfo } from '../CourseBasicInfo/CourseBasicInfo';
import { CourseImageUpload } from '../components/ImageUpload/ImageUpload';


interface CourseCreatePageProps {
  mode: 'create' | 'edit';
  course?: Course | null;
  onSubmit: (courseData: Partial<Course>) => Promise<void>;
  onCancel: () => void;
}

export function CourseCreatePage({
  mode,
  course,
  onSubmit,
  onCancel
}: CourseCreatePageProps) {
  const router = useRouter();
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
  }, [course, mode]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('/api/users/instructors');
        console.log('API Response:', response.data);
        
        // Check if response.data has an instructors property
        if (response.data && response.data.instructors) {
          setInstructors(response.data.instructors);
        } else {
          // Fallback if the structure is different
          setInstructors(Array.isArray(response.data) ? response.data : []);
        }
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

    if (!formData.title || !formData.description || !formData.category) {
      showAlert('error', 'Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
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

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      {showSuccess && (
        <SuccessAlert
          message={`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      <div className={styles.header}>
        <button 
          onClick={onCancel}
          className={styles.backButton}
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </button>
        <h1>{mode === 'create' ? 'Create New Course' : 'Edit Course'}</h1>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSections}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              <div className={styles.sectionContent}>
                <CourseBasicInfo 
                  formData={formData} 
                  setFormData={setFormData} 
                />
              </div>
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Instructor</h2>
              <div className={styles.sectionContent}>
                <CourseInstructorSelect 
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
              </div>
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Course Image</h2>
              <div className={styles.sectionContent}>
                <CourseImageUpload 
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
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
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
      </div>
    </div>
  );
}