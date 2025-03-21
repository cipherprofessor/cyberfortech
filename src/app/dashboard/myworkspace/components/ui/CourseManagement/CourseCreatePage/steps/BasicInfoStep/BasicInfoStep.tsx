'use client';

import { Info } from 'lucide-react';
import { Course, CourseLevel } from '@/types/courses';
import styles from './BasicInfoStep.module.scss';

interface BasicInfoStepProps {
  formData: Partial<Course>;
  setFormData: (data: Partial<Course>) => void;
  isDark?: boolean;
}

export function BasicInfoStep({
  formData,
  setFormData,
  isDark = false
}: BasicInfoStepProps) {
  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h2>Basic Information</h2>
        <p>Provide essential details about your course</p>
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.formRow}>
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
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">
              <span>Category</span>
              <div className={styles.tooltip}>
                <Info size={14} className={styles.infoIcon} />
                <span className={styles.tooltipText}>Select a category that best fits your course content</span>
              </div>
            </label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className={styles.select}
            >
              <option value="">Select category</option>
              <option value="web-development">Web Development</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="network-security">Network Security</option>
              <option value="ethical-hacking">Ethical Hacking</option>
              <option value="penetration-testing">Penetration Testing</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">
            <span>Description</span>
            <div className={styles.tooltip}>
              <Info size={14} className={styles.infoIcon} />
              <span className={styles.tooltipText}>Provide a detailed overview of the course content and learning outcomes</span>
            </div>
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter course description"
            required
            rows={5}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="price">
              <span>Price ($)</span>
              <div className={styles.tooltip}>
                <Info size={14} className={styles.infoIcon} />
                <span className={styles.tooltipText}>Set a competitive price based on course content and market value</span>
              </div>
            </label>
            <input
              type="number"
              id="price"
              value={formData.price || 0}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">
              <span>Duration</span>
              <div className={styles.tooltip}>
                <Info size={14} className={styles.infoIcon} />
                <span className={styles.tooltipText}>Estimate the total time needed to complete the course</span>
              </div>
            </label>
            <input
              type="text"
              id="duration"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 8 weeks"
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="level">
            <span>Level</span>
            <div className={styles.tooltip}>
              <Info size={14} className={styles.infoIcon} />
              <span className={styles.tooltipText}>Indicate the experience level required to take this course</span>
            </div>
          </label>
          <select
            id="level"
            value={formData.level || 'Beginner'}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
            required
            className={styles.select}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );
}