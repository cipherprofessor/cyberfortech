// src/app/dashboard/myworkspace/menus/enquires/training/components/FilterPanel/FilterPanel.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Tag, Calendar, GraduationCap, Monitor, RefreshCw, Check } from 'lucide-react';
import styles from './FilterPanel.module.scss';

import { CourseFilters, getCategories } from '@/services/course-service';

interface FilterPanelProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
  onClose: () => void;
}

export default function FilterPanel({ 
  filters, 
  onFilterChange, 
  onClose 
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<CourseFilters>(filters);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoryNames = response.categories.map(category => category.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  // Reset filters
  const resetFilters = () => {
    const resetFilters = {
      page: 1,
      limit: filters.limit
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.filterPanel}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.filterHeader}>
        <h3>Filter Courses</h3>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close filters"
        >
          <X size={18} />
        </button>
      </div>

      <div className={styles.filterContent}>
        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <Tag size={16} />
            <span>Category</span>
          </div>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${!localFilters.category ? styles.active : ''}`}
              onClick={() => handleFilterChange('category', 'all')}
            >
              All
              {!localFilters.category && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.filterOption} ${localFilters.category === category ? styles.active : ''}`}
                onClick={() => handleFilterChange('category', category)}
              >
                {category}
                {localFilters.category === category && <Check size={14} className={styles.checkIcon} />}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <Monitor size={16} />
            <span>Mode</span>
          </div>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${!localFilters.mode ? styles.active : ''}`}
              onClick={() => handleFilterChange('mode', 'all')}
            >
              All
              {!localFilters.mode && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            <button
              className={`${styles.filterOption} ${localFilters.mode === 'online' ? styles.active : ''}`}
              onClick={() => handleFilterChange('mode', 'online')}
            >
              Online
              {localFilters.mode === 'online' && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            <button
              className={`${styles.filterOption} ${localFilters.mode === 'hybrid' ? styles.active : ''}`}
              onClick={() => handleFilterChange('mode', 'hybrid')}
            >
              Hybrid
              {localFilters.mode === 'hybrid' && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            <button
              className={`${styles.filterOption} ${localFilters.mode === 'in-person' ? styles.active : ''}`}
              onClick={() => handleFilterChange('mode', 'in-person')}
            >
              In-Person
              {localFilters.mode === 'in-person' && <Check size={14} className={styles.checkIcon} />}
            </button>
          </div>
        </div>

        {/* Level Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <GraduationCap size={16} />
            <span>Level</span>
          </div>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${!localFilters.level ? styles.active : ''}`}
              onClick={() => handleFilterChange('level', 'all')}
            >
              All
              {!localFilters.level && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            <button
              className={`${styles.filterOption} ${localFilters.level === 'beginner' ? styles.active : ''}`}
              onClick={() => handleFilterChange('level', 'beginner')}
            >
              Beginner
              {localFilters.level === 'beginner' && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            <button
              className={`${styles.filterOption} ${localFilters.level === 'intermediate' ? styles.active : ''}`}
              onClick={() => handleFilterChange('level', 'intermediate')}
            >
              Intermediate
              {localFilters.level === 'intermediate' && <Check size={14} className={styles.checkIcon} />}
            </button>
            
            <button
              className={`${styles.filterOption} ${localFilters.level === 'advanced' ? styles.active : ''}`}
              onClick={() => handleFilterChange('level', 'advanced')}
            >
              Advanced
              {localFilters.level === 'advanced' && <Check size={14} className={styles.checkIcon} />}
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <Calendar size={16} />
            <span>Date Range</span>
          </div>
          <div className={styles.dateInputs}>
            <div className={styles.dateField}>
              <label htmlFor="dateFrom">From</label>
              <input 
                type="date" 
                id="dateFrom"
                value={localFilters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className={styles.dateInput}
              />
            </div>
            
            <div className={styles.dateField}>
              <label htmlFor="dateTo">To</label>
              <input 
                type="date" 
                id="dateTo"
                value={localFilters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.filterActions}>
        <button 
          className={styles.resetButton}
          onClick={resetFilters}
        >
          <RefreshCw size={16} />
          Reset Filters
        </button>
        
        <button 
          className={styles.applyButton}
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
}