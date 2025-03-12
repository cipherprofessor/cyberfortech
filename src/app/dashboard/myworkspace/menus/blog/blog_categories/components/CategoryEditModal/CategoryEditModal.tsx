import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LinkIcon, AlertTriangle, ImageIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { BlogCategory } from '@/types/blog';
import styles from './CategoryEditModal.module.scss';
import { CategoryEditModalProps, CategoryFormData } from '../../types';



export function CategoryEditModal({
  show,
  category,
  isEditing,
  parentOptions,
  onClose,
  onSave
}: CategoryEditModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    parentId: null,
    imageUrl: null
  });
  
  // Image preview state
  const [imagePreviewError, setImagePreviewError] = useState<boolean>(false);
  const [imagePreviewLoading, setImagePreviewLoading] = useState<boolean>(false);
  
  // Set initial form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        displayOrder: category.displayOrder,
        parentId: category.parentId,
        imageUrl: category.imageUrl || null
      });
      
      // Reset image preview states
      setImagePreviewError(false);
      setImagePreviewLoading(false);
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        displayOrder: 0,
        parentId: null,
        imageUrl: null
      });
      
      // Reset image preview states
      setImagePreviewError(false);
      setImagePreviewLoading(false);
    }
  }, [category, show]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle image URL changes
    if (name === 'imageUrl') {
      setImagePreviewError(false);
      setImagePreviewLoading(true);
    }
    
    // Generate slug from name if name field is being edited and not in edit mode
    if (name === 'name' && !isEditing) {
      setFormData({
        ...formData,
        [name]: value,
        slug: value.toLowerCase()
          .replace(/[^\w\s-]/g, '')  // Remove special chars except whitespace and hyphens
          .replace(/\s+/g, '-')      // Replace spaces with hyphens
          .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle image load
  const handleImageLoad = () => {
    setImagePreviewLoading(false);
    setImagePreviewError(false);
  };
  
  // Handle image error
  const handleImageError = () => {
    setImagePreviewLoading(false);
    setImagePreviewError(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={clsx(styles.overlay, isDark && styles.dark)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.modalHeader}>
              <h2>{isEditing ? 'Edit Category' : 'Create New Category'}</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formContent}>
                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Category Name <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Technology"
                        className={styles.input}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="slug">
                        Slug <span className={styles.required}>*</span>
                        {isEditing && <span className={styles.disabledNote}>(Cannot be changed)</span>}
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. technology"
                        className={styles.input}
                        disabled={isEditing} // Cannot edit slug of existing category
                      />
                      <small>The URL-friendly version of the name. Auto-generated for new categories.</small>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe what this category covers..."
                        className={styles.textarea}
                        rows={4}
                      />
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="displayOrder">Display Order</label>
                        <input
                          type="number"
                          id="displayOrder"
                          name="displayOrder"
                          value={formData.displayOrder}
                          onChange={handleInputChange}
                          min="0"
                          step="1"
                          className={styles.input}
                        />
                        <small>Lower numbers appear first</small>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="parentId">Parent Category</label>
                        <select
                          id="parentId"
                          name="parentId"
                          value={formData.parentId || ''}
                          onChange={handleInputChange}
                          className={styles.select}
                        >
                          <option value="">None (Top-level category)</option>
                          {parentOptions.map(parent => (
                            // Don't allow selecting itself as parent when editing
                            formData.id !== parent.id && (
                              <option key={parent.id} value={parent.id}>
                                {parent.name}
                              </option>
                            )
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label>Category Icon URL</label>
                      <div className={styles.urlInput}>
                        <div className={styles.inputWithIcon}>
                          <LinkIcon size={16} className={styles.inputIcon} />
                          <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl || ''}
                            onChange={handleInputChange}
                            placeholder="https://example.com/icon.png"
                            className={styles.input}
                          />
                        </div>
                        
                        <div className={styles.imagePreviewContainer}>
                          {formData.imageUrl ? (
                            <div className={styles.imagePreview}>
                              {imagePreviewError ? (
                                <div className={styles.imageError}>
                                  <AlertTriangle size={16} />
                                  <span>Invalid image URL</span>
                                </div>
                              ) : (
                                <>
                                  {imagePreviewLoading && (
                                    <div className={styles.loadingOverlay}>
                                      <span>Loading...</span>
                                    </div>
                                  )}
                                  <img 
                                    src={formData.imageUrl}
                                    alt="Icon Preview"
                                    className={styles.previewImage}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                  />
                                </>
                              )}
                            </div>
                          ) : (
                            <div className={styles.noImagePreview}>
                              <ImageIcon size={24} className={styles.placeholderIcon} />
                              <span>No image URL provided</span>
                            </div>
                          )}
                        </div>
                        
                        <small>Enter a URL for your category icon (SVG or PNG recommended)</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                  >
                    {isEditing ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}