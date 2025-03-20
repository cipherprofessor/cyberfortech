"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Monitor, Users, BookOpen } from 'lucide-react';
import styles from './CoursesFilterBar.module.scss';

interface CoursesFilterBarProps {
  onSearch: (term: string) => void;
  onFilterChange: (category: string, mode: string, month: string, level: string) => void;
  selectedCategory: string;
  selectedMode: string;
  selectedMonth: string;
  selectedLevel: string;
}

export default function CoursesFilterBar({ 
  onSearch, 
  onFilterChange,
  selectedCategory,
  selectedMode,
  selectedMonth,
  selectedLevel
}: CoursesFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Categories options
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Security', label: 'Security' },
    { value: 'Development', label: 'Development' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'Blockchain', label: 'Blockchain' }
  ];
  
  // Modes options
  const modes = [
    { value: 'all', label: 'All Modes' },
    { value: 'online', label: 'Online' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'hybrid', label: 'Hybrid' }
  ];
  
  // Months options
  const months = [
    { value: 'all', label: 'All Months' },
    { value: 'jan', label: 'January' },
    { value: 'feb', label: 'February' },
    { value: 'mar', label: 'March' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'jun', label: 'June' },
    { value: 'jul', label: 'July' },
    { value: 'aug', label: 'August' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'October' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' }
  ];
  
  // Level options
  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <motion.div 
      className={styles.filterBar}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.searchRow}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search courses, instructors..."
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
        
        <button 
          className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
          onClick={toggleFilters}
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>
      
      <motion.div 
        className={styles.filtersContainer}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.filterGroups}>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <BookOpen size={16} className={styles.filterIcon} />
              <span>Category</span>
            </div>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => onFilterChange(
                e.target.value, 
                selectedMode,
                selectedMonth,
                selectedLevel
              )}
            >
              {categories.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <Monitor size={16} className={styles.filterIcon} />
              <span>Mode</span>
            </div>
            <select
              className={styles.filterSelect}
              value={selectedMode}
              onChange={(e) => onFilterChange(
                selectedCategory,
                e.target.value,
                selectedMonth,
                selectedLevel
              )}
            >
              {modes.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <Calendar size={16} className={styles.filterIcon} />
              <span>Month</span>
            </div>
            <select
              className={styles.filterSelect}
              value={selectedMonth}
              onChange={(e) => onFilterChange(
                selectedCategory,
                selectedMode,
                e.target.value,
                selectedLevel
              )}
            >
              {months.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <Users size={16} className={styles.filterIcon} />
              <span>Level</span>
            </div>
            <select
              className={styles.filterSelect}
              value={selectedLevel}
              onChange={(e) => onFilterChange(
                selectedCategory,
                selectedMode,
                selectedMonth,
                e.target.value
              )}
            >
              {levels.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.filterActions}>
          <button 
            className={styles.resetButton}
            onClick={() => onFilterChange('all', 'all', 'all', 'all')}
          >
            Reset Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}