import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import styles from './TeacherModals.module.scss';

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const CreateTeacherModal: React.FC<CreateTeacherModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    specialization: '',
    years_of_experience: '',
    bio: '',
    profile_image_url: '',
  });

  const [imageUploadType, setImageUploadType] = useState<'file' | 'url'>('file');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          // Here you would normally upload to your storage service
          // and get back a URL to store in formData
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        years_of_experience: parseInt(formData.years_of_experience)
      });
      onClose();
    } catch (error) {
      console.error('Error creating teacher:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay} onClick={onClose}>
        <motion.div 
          className={styles.modalContent}
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>

          <form onSubmit={handleSubmit} className={styles.createForm}>
            <h3>Add New Teacher</h3>

            <div className={styles.imageSection}>
              <div className={styles.imagePreview}>
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <Upload size={24} />
                    <span>Upload Image</span>
                  </div>
                )}
              </div>

              <div className={styles.imageTypeToggle}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${imageUploadType === 'file' ? styles.active : ''}`}
                  onClick={() => setImageUploadType('file')}
                >
                  <Upload size={16} />
                  Upload
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${imageUploadType === 'url' ? styles.active : ''}`}
                  onClick={() => setImageUploadType('url')}
                >
                  <LinkIcon size={16} />
                  URL
                </button>
              </div>

              {imageUploadType === 'file' ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              ) : (
                <input
                  type="url"
                  name="profile_image_url"
                  placeholder="Image URL"
                  value={formData.profile_image_url}
                  onChange={handleChange}
                  className={styles.input}
                />
              )}
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select Specialization</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  required
                  min="0"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
              />
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                Create Teacher
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateTeacherModal;