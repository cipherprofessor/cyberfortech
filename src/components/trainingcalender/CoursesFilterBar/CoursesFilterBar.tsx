"use client"
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, RefreshCw, CheckCircle2, Laptop, Calendar, GraduationCap, Tag } from 'lucide-react';
import styles from './CoursesFilterBar.module.scss';

interface CoursesFilterBarProps {
  onSearch: (term: string) => void;
  onFilterChange: (category: string, mode: string, month: string, level: string) => void;
  selectedCategory: string;
  selectedMode: string;
  selectedMonth: string;
  selectedLevel: string;
}

export function CoursesFilterBar({
  onSearch,
  onFilterChange,
  selectedCategory,
  selectedMode,
  selectedMonth,
  selectedLevel
}: CoursesFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(selectedCategory);
  const [mode, setMode] = useState(selectedMode);
  const [month, setMonth] = useState(selectedMonth);
  const [level, setLevel] = useState(selectedLevel);
  const [isFiltersChanged, setIsFiltersChanged] = useState(false);

  // Check if filters have been changed from their initial values
  useEffect(() => {
    const hasChanged = 
      category !== selectedCategory || 
      mode !== selectedMode || 
      month !== selectedMonth || 
      level !== selectedLevel;
    
    setIsFiltersChanged(hasChanged);
  }, [category, mode, month, level, selectedCategory, selectedMode, selectedMonth, selectedLevel]);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Small delay to prevent excessive API calls while typing
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle filter apply button click
  const handleApplyFilters = () => {
    onFilterChange(category, mode, month, level);
  };

  // Handle reset filters button click
  const handleResetFilters = () => {
    setCategory('all');
    setMode('all');
    setMonth('all');
    setLevel('all');
    setSearchTerm('');
    onSearch('');
    onFilterChange('all', 'all', 'all', 'all');
  };

  return (
    <div className={styles.filterBar}>
        <h3 className={styles.filterTitle}>
        <Filter size={18} className={styles.titleIcon} />
        Filter Courses
      </h3>
      
      
      <div className={styles.filterForm}>
        <div className={styles.topFilterRow}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search courses by title, instructor, or keyword"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className={styles.modeFilterGroup}>
            {/* <div className={styles.filterLabel}>
              <Laptop size={14} className={styles.labelIcon} />
              Course Mode
            </div> */}
            <div className={styles.modeToggleContainer}>
              <button 
                className={`${styles.modeToggleButton} ${mode === 'all' ? styles.activeMode : ''}`}
                onClick={() => setMode('all')}
              >
                All
              </button>
              <button 
                className={`${styles.modeToggleButton} ${mode === 'online' ? styles.activeMode : ''}`}
                onClick={() => setMode('online')}
              >
                Online
              </button>
              <button 
                className={`${styles.modeToggleButton} ${mode === 'hybrid' ? styles.activeMode : ''}`}
                onClick={() => setMode('hybrid')}
              >
                Hybrid
              </button>
              <button 
                className={`${styles.modeToggleButton} ${mode === 'in-person' ? styles.activeMode : ''}`}
                onClick={() => setMode('in-person')}
              >
                Offline
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomFilterRow}>
          <div className={styles.categoryFilter}>
            <div className={styles.filterGroup}>
              <div className={styles.filterLabel}>
                <Tag size={14} className={styles.labelIcon} />
                Category
              </div>
              <div className={styles.selectWrapper}>
                <select
                  id="category"
                  className={styles.filterSelect}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Security">Security</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Development">Development</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="DevOps">DevOps</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>
          
          <div className={styles.monthFilter}>
            <div className={styles.filterGroup}>
              <div className={styles.filterLabel}>
                <Calendar size={14} className={styles.labelIcon} />
                Month
              </div>
              <div className={styles.selectWrapper}>
                <select
                  id="month"
                  className={styles.filterSelect}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="all">All Months</option>
                  <option value="jan">January</option>
                  <option value="feb">February</option>
                  <option value="mar">March</option>
                  <option value="apr">April</option>
                  <option value="may">May</option>
                  <option value="jun">June</option>
                  <option value="jul">July</option>
                  <option value="aug">August</option>
                  <option value="sep">September</option>
                  <option value="oct">October</option>
                  <option value="nov">November</option>
                  <option value="dec">December</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>
          
          <div className={styles.levelFilter}>
            <div className={styles.filterGroup}>
              <div className={styles.filterLabel}>
                <GraduationCap size={14} className={styles.labelIcon} />
                Experience Level
              </div>
              <div className={styles.selectWrapper}>
                <select
                  id="level"
                  className={styles.filterSelect}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>
          
          <div className={styles.filterActions}>
            <button
              className={styles.resetButton}
              onClick={handleResetFilters}
            >
              <RefreshCw size={16} className={styles.buttonIcon} />
              <span>Reset</span>
            </button>
            
            <button
              className={styles.applyButton}
              onClick={handleApplyFilters}
              disabled={!isFiltersChanged}
            >
              <CheckCircle2 size={16} className={styles.buttonIcon} />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesFilterBar;