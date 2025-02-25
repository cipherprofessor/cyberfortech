'use client';

import { useState } from 'react';
import { Info, Image as ImageIcon, Link, Trash2, Upload } from 'lucide-react';
import styles from './CourseImageUpload.module.scss';
import { Course } from '@/types/courses';

interface CourseImageUploadProps {
  imagePreview: string | null;
  isFileUpload: boolean;
  formData: Partial<Course>;
  setFormData: (data: Partial<Course>) => void;
  setImagePreview: (preview: string | null) => void;
  showAlert: (type: 'success' | 'error', message: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: () => void;
  setIsFileUpload: (isFileUpload: boolean) => void;
  isDark?: boolean;
}

export function CourseImageUpload({
  imagePreview,
  isFileUpload,
  formData,
  setFormData,
  setImagePreview,
  showAlert,
  handleImageUpload,
  removeImage,
  setIsFileUpload,
  isDark = false
}: CourseImageUploadProps) {
  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
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
          <Link size={16} />
          <span>Image URL</span>
        </button>
        <button
          type="button"
          className={`${styles.methodButton} ${isFileUpload ? styles.active : ''}`}
          onClick={() => setIsFileUpload(true)}
        >
          <Upload size={16} />
          <span>Upload Image</span>
        </button>
      </div>

      {isFileUpload ? (
        <div className={styles.imageUpload}>
          <div className={styles.uploadArea}>
            {imagePreview ? (
              <div className={styles.previewImage}>
                <img src={imagePreview} alt="Course preview" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className={styles.removeImage}
                  aria-label="Remove image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                />
                <ImageIcon size={32} className={styles.uploadIcon} />
                <p>Click or drag image to upload</p>
                <span className={styles.uploadHint}>
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                </span>
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.imageUrlInput}>
          <div className={styles.inputWithIcon}>
            <Link size={16} />
            <input
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
              className={styles.input}
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
                  aria-label="Remove image"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}