'use client';

import { useState } from 'react';
import { Info, Image as ImageIcon, Link, Trash2, Upload } from 'lucide-react';
import { Course } from '@/types/courses';
import styles from './CourseImageStep.module.scss';

interface CourseImageStepProps {
  imagePreview: string | null;
  isFileUpload: boolean;
  formData: Partial<Course>;
  setFormData: (data: Partial<Course>) => void;
  setImagePreview: (preview: string | null) => void;
  setIsFileUpload: (isFileUpload: boolean) => void;
  isDark?: boolean;
  showAlert: (type: 'success' | 'error', message: string) => void;
}

export function CourseImageStep({
  imagePreview,
  isFileUpload,
  formData,
  setFormData,
  setImagePreview,
  setIsFileUpload,
  isDark = false,
  showAlert
}: CourseImageStepProps) {
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
      setFormData({ ...formData, image_url: '' });   ///Need to check this line
      setImagePreview(URL.createObjectURL(file));
      showAlert('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      showAlert('error', 'Failed to upload image');
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image_url: '' });  ///Need to check this line
    setImagePreview(null);
  };

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h2>Course Image</h2>
        <p>Add a compelling image that represents your course</p>
      </div>
      
      <div className={styles.imageOptionsContainer}>
        <div className={styles.methodSelector}>
          <button
            type="button"
            className={`${styles.methodButton} ${!isFileUpload ? styles.active : ''}`}
            onClick={() => setIsFileUpload(false)}
          >
            <Link size={18} />
            <span>Image URL</span>
          </button>
          <button
            type="button"
            className={`${styles.methodButton} ${isFileUpload ? styles.active : ''}`}
            onClick={() => setIsFileUpload(true)}
          >
            <Upload size={18} />
            <span>Upload Image</span>
          </button>
        </div>
        
        {isFileUpload ? (
          <div className={styles.uploadContainer}>
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Course preview" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className={styles.removeButton}
                  aria-label="Remove image"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <label className={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                />
                <ImageIcon size={48} className={styles.uploadIcon} />
                <h3>Drag & drop or click to upload</h3>
                <p>Supported formats: JPEG, PNG, WebP (max 5MB)</p>
              </label>
            )}
          </div>
        ) : (
          <div className={styles.urlContainer}>
            <div className={styles.urlInputGroup}>
              <label htmlFor="image-url">Image URL</label>
              <div className={styles.urlInputWrapper}>
                <Link size={18} className={styles.urlIcon} />
                <input
                  id="image-url"
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  placeholder="Enter image URL"
                  className={styles.urlInput}
                />
              </div>
            </div>
            
            {imagePreview && (
              <div className={styles.imagePreview}>
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
                    className={styles.removeButton}
                    aria-label="Remove image"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className={styles.imageGuidelines}>
          <h3>Image Guidelines</h3>
          <ul>
            <li>Use high-quality images that represent your course content</li>
            <li>Recommended aspect ratio is 16:9</li>
            <li>Minimum recommended resolution is 1280×720 pixels</li>
            <li>Avoid text-heavy images as they may not be readable on small screens</li>
            <li>Ensure you have the right to use any images you upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}