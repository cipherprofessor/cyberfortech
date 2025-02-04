"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { X, Loader } from 'lucide-react';
import styles from './NewTopicForm.module.scss';

interface Category {
  id: number;
  name: string;
  subCategories: Array<{
    id: number;
    name: string;
  }>;
}

export interface NewTopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function NewTopicForm({ 
  isOpen, 
  onClose, 
  categories: initialCategories 
}: NewTopicFormProps) {
  const router = useRouter();
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    subcategoryId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'categoryId' && { subcategoryId: '' })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('You must be logged in to create a topic');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/forum/topics', {
        ...formData,
        authorId: userId
      });

      router.push(`/forum/topics/${response.data.id}`);
      router.refresh();
      handleClose();
    } catch (err) {
      setError('Failed to create topic. Please try again.');
      console.error('Error creating topic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      categoryId: '',
      subcategoryId: '',
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategory = initialCategories.find(
    cat => cat.id.toString() === formData.categoryId
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create New Topic</h2>
          <button 
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter topic title"
              disabled={isSubmitting}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.select}
              required
            >
              <option value="">Select a category</option>
              {initialCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory?.subCategories && selectedCategory.subCategories.length > 0 && (
            <div className={styles.formGroup}>
              <label htmlFor="subcategoryId">Subcategory (Optional)</label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={styles.select}
              >
                <option value="">Select a subcategory</option>
                {selectedCategory.subCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter your topic content"
              disabled={isSubmitting}
              className={styles.textarea}
              required
              rows={8}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className={styles.spinner} size={16} />
                  Creating...
                </>
              ) : (
                'Create Topic'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}