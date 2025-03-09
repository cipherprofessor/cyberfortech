// src/components/blog/TrendingTopics/index.tsx
"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { BlogCategory } from '@/types/blog';
import styles from './TrendingTopics.module.scss';
import next from 'next';

// Map of category slugs to emoji icons
const CATEGORY_ICONS: Record<string, string> = {
  technology: '💻',
  business: '💼',
  design: '🎨',
  development: '⚙️',
  marketing: '📈',
  productivity: '⏱️',
  finance: '💰',
  health: '🏥',
  travel: '✈️',
  food: '🍔',
  fashion: '👗',
  sports: '⚽',
  music: '🎵',
  movies: '🎬',
  books: '📚',
  news: '📰',
  startups: '🚀',
  education: '🎓',
  personal: '👤',
  lifestyle: '🌿',
  management: '📊',
  trends: '🔥',
  react : '⚛️', // Add more as needed
  next : '📝', // Add more as needed
  webdevelopment : '📝', // Add more as needed
  cybersecurity :   '📝', // Add more as needed
  
  // Add more as needed
  default: '📝', // Default icon
};

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

  // Helper to get appropriate icon for a category
  const getCategoryIcon = (slug: string): string => {
    const normalizedSlug = slug.toLowerCase();
    
    // Try to find an exact match first
    if (CATEGORY_ICONS[normalizedSlug]) {
      return CATEGORY_ICONS[normalizedSlug];
    }
    
    // Try to find a partial match
    const matchingKey = Object.keys(CATEGORY_ICONS).find(key => 
      normalizedSlug.includes(key) || key.includes(normalizedSlug)
    );
    
    return matchingKey ? CATEGORY_ICONS[matchingKey] : CATEGORY_ICONS.default;
  };

  return (
    <div className={clsx(
      styles.container,
      theme === 'dark' && styles.dark,
      className
    )}>
      <h2 className={styles.sectionTitle}>EXPLORE TRENDING TOPICS</h2>
      
      <div className={styles.topicsGrid}>
        {loading ? (
          // Skeleton loaders for categories
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.topicButtonSkeleton}></div>
          ))
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : categories.length === 0 ? (
          <div className={styles.empty}>No categories available</div>
        ) : (
          // Actual categories
          categories.map(category => (
            <button
              key={category.id}
              className={clsx(
                styles.topicButton,
                selectedCategory === category.slug && styles.active
              )}
              onClick={() => onCategorySelect(category.slug)}
              aria-pressed={selectedCategory === category.slug}
            >
              <span className={styles.topicIcon}>
                {getCategoryIcon(category.slug)}
              </span>
              <span className={styles.topicName}>{category.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingTopics;