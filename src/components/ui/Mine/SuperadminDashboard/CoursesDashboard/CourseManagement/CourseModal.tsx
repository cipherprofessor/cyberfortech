// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload,
  Save,
  Trash2,
  DollarSign,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  GraduationCap,
  Tag,
  Info
} from 'lucide-react';

import { Course } from '@/types/courses';
import { useTheme } from 'next-themes';
import styles from './CourseModal.module.scss';
import { SuccessAlert, ErrorAlert } from '../../../Alert/Alert';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  course?: Course | null;
  onSubmit: (courseData: Partial<Course>) => Promise<void>;
}

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
  
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'beginner',
    category: '',
    image_url: '',
  });

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData(course);
      setImagePreview(course.image_url || null);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'beginner',
        category: '',
        image_url: '',
      });
      setImagePreview(null);
    }
  }, [course, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // File validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP)');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('Image size should be less than 5MB');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
      setErrorMessage('Failed to upload image');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
              <div className={styles.formGroup}>
                <label htmlFor="title">
                  <span>Course Title</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                  required
                  minLength={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">
                  <span>Category</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  <option value="web-development">Web Development</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="network-security">Network Security</option>
                  <option value="ethical-hacking">Ethical Hacking</option>
                  <option value="penetration-testing">Penetration Testing</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="description">
                  <span>Description</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  required
                  minLength={10}
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price">
                  <span>Price ($)</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <div className={styles.inputWithIcon}>
                  <DollarSign size={16} />
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="duration">
                  <span>Duration</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <div className={styles.inputWithIcon}>
                  <Clock size={16} />
                  <input
                    type="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 8 weeks"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="level">
                  <span>Level</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  <span>Course Image</span>
                  <Info size={14} className={styles.infoIcon} />
                </label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  {imagePreview ? (
                    <div className={styles.previewImage}>
                      <img src={imagePreview} alt="Course preview" />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className={styles.removeImage}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadArea}>
                      <ImageIcon size={32} className={styles.uploadIcon} />
                      <p>Click or drag image to upload</p>
                      <span className={styles.uploadHint}>
                        Supported formats: JPEG, PNG, WebP (max 5MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
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