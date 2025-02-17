// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseModal.tsx
'use client';
//Alpha Centauri
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
  Info,
  Link
} from 'lucide-react';

import { Course, CourseLevel, CourseModalProps, Instructor } from '@/types/courses';
import { useTheme } from 'next-themes';
import styles from './CourseModal.module.scss';
import { SuccessAlert, ErrorAlert } from '../../../Alert/Alert';
import { Listbox, ListboxItem, Avatar } from "@heroui/react";
import axios from 'axios';
import { Selection } from '@heroui/react';



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
  const [selectedInstructor, setSelectedInstructor] = useState<Selection>(new Set([]));
  
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Beginner', // Changed from 'beginner'
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
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'Beginner', // Changed from 'beginner'
        category: '',
        image_url: '',
      });
      setImagePreview(null);
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
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>A clear, descriptive title helps students understand what they'll learn</span>
    </div>
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
                  <span>Course Title</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Enter a clear and concise title for your course</span>
    </div>
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
                  <span>Course Title</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Provide a detailed overview of the course content and learning outcomes</span>
    </div>
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
                  <span>Course Title</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Set a competitive price based on course content and market value</span>
    </div>
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
                  <span>Course Title</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Estimate the total time needed to complete the course</span>
    </div>
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
                  <span>Course Title</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Indicate the experience level required to take this course</span>
    </div>
                </label>
                <select
  id="level"
  value={formData.level}
  onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
  required
>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>
              </div>

              {/* Instructors Section */}


              <div className={styles.formGroup}>
  <label htmlFor="instructor">
    <span>Course Instructor</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Select the instructor who will teach this course</span>
    </div>
  </label>
  <div className={styles.instructorSelect}>


  <Listbox
  classNames={{
    base: "w-full",
    list: "max-h-[200px] overflow-auto",
  }}
  defaultSelectedKeys={course?.instructor_id ? [course.instructor_id] : []}
  items={instructors}
  label="Select Instructor"
  variant="flat"
  selectionMode="single"
  onSelectionChange={(keys: Selection) => {
    setSelectedInstructor(keys);
    // Selection is a string for single selection mode
    const instructorId = Array.from(keys)[0];
    if (instructorId) {
      setFormData(prev => ({
        ...prev,
        instructor_id: instructorId.toString()
      }));
    }
  }}
>
  {(instructor: Instructor) => (
    <ListboxItem key={instructor.id} textValue={instructor.name}>
      <div className="flex gap-2 items-center">
        <Avatar 
          alt={instructor.name} 
          className="flex-shrink-0" 
          size="sm" 
          src={instructor.profile_image_url || '/default-avatar.png'} 
        />
        <div className="flex flex-col">
          <span className="text-small">{instructor.name}</span>
          <span className="text-tiny text-default-400">{instructor.email}</span>
        </div>
      </div>
    </ListboxItem>
  )}
</Listbox>


  </div>
</div>

    

<div className={`${styles.formGroup} ${styles.fullWidth}`}>
  <label>
    <span>Course Image</span>
    <div className={styles.tooltip}>
      <Info size={14} className={styles.infoIcon} />
      <span className={styles.tooltipText}>Add a compelling image that represents your course. Use high-quality images for better visibility.</span>
    </div>
  </label>

  <div className={styles.imageMethodToggle}>
    <button
      type="button"
      className={`${styles.methodButton} ${!isFileUpload ? styles.active : ''}`}
      onClick={() => setIsFileUpload(false)}
    >
      Image URL
    </button>
    <button
      type="button"
      className={`${styles.methodButton} ${isFileUpload ? styles.active : ''}`}
      onClick={() => setIsFileUpload(true)}
    >
      Upload Image
    </button>
  </div>

  {isFileUpload ? (
    <div className={styles.imageUpload}>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.fileInput}
      />
      <div className={styles.uploadArea}>
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
          <>
            <ImageIcon size={32} className={styles.uploadIcon} />
            <p>Click or drag image to upload</p>
            <span className={styles.uploadHint}>
              Supported formats: JPEG, PNG, WebP (max 5MB)
            </span>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className={styles.imageUrlInput}>
      <div className={styles.inputWithIcon}>
        <Link size={16} />
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => {
            setFormData({ ...formData, image_url: e.target.value });
            if (e.target.value) {
              setImagePreview(e.target.value);
            } else {
              setImagePreview(null);
            }
          }}
          placeholder="Enter image URL"
        />
      </div>
      {imagePreview && (
        <div className={styles.urlPreviewImage}>
          <img 
            src={imagePreview} 
            alt="Course preview"
            onError={() => {
              setImagePreview(null);
              showAlert('error', 'Invalid image URL');
            }}
          />
          {formData.image_url && (
            <button 
              type="button"
              onClick={() => {
                setFormData({ ...formData, image_url: '' });
                setImagePreview(null);
              }}
              className={styles.removeImage}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  )}
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