// src/components/ForumCategories/CategoryForm/CategoryForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Loader2, 
  X, 
  Layout, 
  Palette, 
  ListOrdered,
  ToggleLeft,
  Hash
} from 'lucide-react';
import styles from './CategoryForm.module.scss';

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  display_order: number;
  is_active: boolean;
  total_topics: number;
  total_posts: number;
  last_post_at?: string;
  subCategories: Array<{ id: string; name: string; }>;
}

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: '',
    color: '#6366F1',
    display_order: 0,
    is_active: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon || '',
        color: initialData.color || '#6366F1',
        display_order: initialData.display_order,
        is_active: initialData.is_active
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <h2>{initialData ? 'Edit Category' : 'Create New Category'}</h2>
        <button 
          type="button" 
          onClick={onCancel}
          className={styles.closeButton}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formContent}>
          <div className={styles.formSection}>
            <h3>Basic Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">
                <Layout size={16} />
                Category Name
                <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="e.g., Programming Basics"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">
                <Hash size={16} />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Brief description of this category..."
                rows={4}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Appearance</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="icon">
                  <Layout size={16} />
                  Icon
                </label>
                <input
                  id="icon"
                  name="icon"
                  type="text"
                  value={formData.icon}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g., 📚 or icon class"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="color">
                  <Palette size={16} />
                  Theme Color
                </label>
                <div className={styles.colorInputWrapper}>
                  <input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={styles.colorInput}
                  />
                  <span className={styles.colorValue}>{formData.color}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Settings</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="display_order">
                  <ListOrdered size={16} />
                  Display Order
                </label>
                <input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleChange}
                  className={styles.input}
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.toggleLabel}>
                  <ToggleLeft size={16} />
                  Category Status
                </label>
                <div className={styles.toggle}>
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className={styles.toggleInput}
                  />
                  <label 
                    htmlFor="is_active" 
                    className={styles.toggleSwitch}
                  >
                    <span className={styles.toggleLabel} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
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
                <Loader2 className={styles.spinner} />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Update Category' : 'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}