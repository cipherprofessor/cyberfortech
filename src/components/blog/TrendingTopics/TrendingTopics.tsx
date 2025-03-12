// src/components/blog/TrendingTopics/index.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { BlogCategory } from '@/types/blog';
import styles from './TrendingTopics.module.scss';

interface TrendingTopicsProps {
  initialCategories?: BlogCategory[];
  selectedCategory?: string | null;
  onCategorySelect: (category: string) => void;
  className?: string;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  initialCategories = [],
  selectedCategory = null,
  onCategorySelect,
  className,
}) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
  const [loading, setLoading] = useState<boolean>(initialCategories.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Only fetch if we don't have initial categories
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  }, [initialCategories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle image error
  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [categoryId]: true
    }));
  };

  // Get default image path
  const getDefaultImage = (categorySlug: string) => {
    return '/logocyber4.png'; // Your default fallback image
  };

  return (
    <div className={clsx(styles.container, theme === 'dark' && styles.dark, className)}>
      <h2 className={styles.sectionTitle}>EXPLORE TRENDING TOPICS</h2>
      <div className={styles.topicsGrid}>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.topicButtonSkeleton}></div>
          ))
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : categories.length === 0 ? (
          <div className={styles.empty}>No categories available</div>
        ) : (
          categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.slug)}
              className={clsx(
                styles.topicButton,
                selectedCategory === category.slug && styles.active
              )}
            >
              <span className={styles.topicIcon}>
                <Image 
                  src={imageErrors[category.id] ? getDefaultImage(category.slug) : (category.imageUrl || getDefaultImage(category.slug))}
                  alt=""
                  width={24}
                  height={24}
                  onError={() => handleImageError(category.id)}
                  className={styles.categoryImage}
                />
              </span>
              <span className={styles.topicName}>{category.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default TrendingTopics;