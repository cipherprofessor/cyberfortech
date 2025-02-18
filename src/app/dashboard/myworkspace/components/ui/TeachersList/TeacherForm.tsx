// src/app/dashboard/myworkspace/components/ui/TeachersList/TeacherForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import styles from './TeacherForm.module.scss';

interface TeacherFormProps {
    mode: 'create' | 'edit';
    initialData?: TeacherFormData | null;
    onClose: () => void;
    onSubmit: (data: TeacherFormData) => Promise<void>;
  }


interface TeacherFormData {
  id?: string;
  name: string;
  email: string;
  bio: string;
//   description: string;
  contact_number: string;
  address: string;
  profile_image_url: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  rating?: number;
  total_students?: number;
  total_courses?: number;
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
  mode,
  initialData,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    bio: '',
    // description: '',
    contact_number: '',
    address: '',
    profile_image_url: '',
    specialization: '',
    qualification: '',
    years_of_experience: 0,
    social_links: {},
    status: 'active'
  });

  console.log('formData', formData);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        social_links: initialData.social_links || {}
      });
      setImagePreview(initialData.profile_image_url);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData: TeacherFormData = {
        ...formData,
        years_of_experience: Number(formData.years_of_experience),
        // Ensure social_links is an object
        social_links: {
          ...formData.social_links,
          // Remove empty social links
          ...(Object.fromEntries(
            Object.entries(formData.social_links).filter(([_, value]) => value)
          ))
        }
      };

      await onSubmit(submissionData);
      toast.success(`Teacher ${mode === 'create' ? 'created' : 'updated'} successfully`, {
        position: 'top-right',
        className: styles.successToast
      });
      onClose();
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} teacher:`, error);
      toast.error(`Failed to ${mode} teacher. Please try again.`, {
        position: 'top-right',
        className: styles.errorToast
      });
    }
  };
      

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social_links.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'profile_image_url') {
      setImagePreview(value);
    }
  };

  return (
    <motion.div 
      className={styles.fullscreenForm}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.header}>
        <h2>{mode === 'create' ? 'Add New Teacher' : 'Edit Teacher'}</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageSection}>
          <div className={styles.uploadArea}>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
                className={styles.previewImage}
                onError={() => setImagePreview(null)}
              />
            ) : (
              <div className={styles.placeholder}>
                <Upload size={40} />
                <span>Upload Image or Provide URL</span>
              </div>
            )}
          </div>
          <input
            type="url"
            name="profile_image_url"
            placeholder="Image URL"
            value={formData.profile_image_url}
            onChange={handleChange}
            className={styles.urlInput}
          />
        </div>

        <div className={styles.formGrid}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h3>Basic Information</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className={styles.field}>
                <label>Description</label>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className={styles.section}>
            <h3>Contact Information</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className={styles.section}>
            <h3>Professional Information</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label>Qualification*</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Specialization*</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
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
              <div className={styles.field}>
                <label>Years of Experience*</label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className={styles.field}>
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.section}>
            <h3>Social Links</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="social_links.linkedin"
                  value={formData.social_links.linkedin || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className={styles.field}>
                <label>Twitter</label>
                <input
                  type="url"
                  name="social_links.twitter"
                  value={formData.social_links.twitter || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className={styles.field}>
                <label>Website</label>
                <input
                  type="url"
                  name="social_links.website"
                  value={formData.social_links.website || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {mode === 'create' ? 'Create Teacher' : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TeacherForm;