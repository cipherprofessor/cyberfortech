// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/components/FormFields/FormFields.tsx
import { DollarSign, Clock, Info, Tag } from 'lucide-react';
import styles from './FormFields.module.scss';
import { Course, CourseLevel } from '@/types/courses';

interface FormFieldsProps {
  formData: Partial<Course>;
  setFormData: (data: Partial<Course>) => void;
}

export const FormFields = ({ formData, setFormData }: FormFieldsProps) => {
  return (
    <>
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
          <div className={styles.tooltip}>
            <Info size={14} className={styles.infoIcon} />
            <span className={styles.tooltipText}>Choose a category that best fits your course content</span>
          </div>
        </label>
        <div className={styles.inputWithIcon}>
          <Tag size={16} />
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
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label htmlFor="description">
          <span>Description</span>
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
            placeholder="Enter course price"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="duration">
          <span>Duration</span>
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
    </>
  );
};