// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/ImageUpload/ImageUpload.tsx
import { ImageIcon, Trash2, Link } from 'lucide-react';
import { Course } from '@/types/courses';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  imagePreview: string | null;
  isFileUpload: boolean;
  formData: Partial<Course>;
  setFormData: (data: Partial<Course>) => void;
  setImagePreview: (preview: string | null) => void;
  showAlert: (type: 'success' | 'error', message: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: () => void;
  setIsFileUpload: (value: boolean) => void;
}

export const ImageUpload = ({
  imagePreview,
  isFileUpload,
  formData,
  setFormData,
  setImagePreview,
  showAlert,
  handleImageUpload,
  removeImage,
  setIsFileUpload
}: ImageUploadProps) => {
  return (
    <div className={styles.imageUploadContainer}>
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
                setImagePreview(e.target.value ? e.target.value : null);
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
                  onClick={removeImage}
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
  );
};