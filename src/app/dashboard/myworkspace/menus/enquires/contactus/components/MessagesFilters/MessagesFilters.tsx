"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar } from 'lucide-react';
import styles from './MessagesFilters.module.scss';

interface MessagesFiltersProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onSourceFilter: (source: string) => void;
  onTimeFilter: (time: string) => void;
  currentStatusFilter: string;
  currentSourceFilter: string;
  currentTimeFilter: string;
}

export default function MessagesFilters({
  onSearch,
  onStatusFilter,
  onSourceFilter,
  onTimeFilter,
  currentStatusFilter,
  currentSourceFilter,
  currentTimeFilter
}: MessagesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <motion.div 
      className={styles.filtersContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.searchAndToggle}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
        
        <button 
          className={styles.filterToggle}
          onClick={toggleFilters}
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>
      
      <motion.div 
        className={styles.filtersRow}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <div className={styles.filterOptions}>
            <button 
              className={`${styles.filterOption} ${currentStatusFilter === 'all' ? styles.active : ''}`}
              onClick={() => onStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterOption} ${currentStatusFilter === 'new' ? styles.active : ''}`}
              onClick={() => onStatusFilter('new')}
            >
              New
            </button>
            <button 
              className={`${styles.filterOption} ${currentStatusFilter === 'in_progress' ? styles.active : ''}`}
              onClick={() => onStatusFilter('in_progress')}
            >
              In Progress
            </button>
            <button 
              className={`${styles.filterOption} ${currentStatusFilter === 'resolved' ? styles.active : ''}`}
              onClick={() => onStatusFilter('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Source</label>
          <div className={styles.filterOptions}>
            <button 
              className={`${styles.filterOption} ${currentSourceFilter === 'all' ? styles.active : ''}`}
              onClick={() => onSourceFilter('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterOption} ${currentSourceFilter === 'partners' ? styles.active : ''}`}
              onClick={() => onSourceFilter('partners')}
            >
              Partners
            </button>
            <button 
              className={`${styles.filterOption} ${currentSourceFilter === 'contact' ? styles.active : ''}`}
              onClick={() => onSourceFilter('contact')}
            >
              Contact
            </button>
            <button 
              className={`${styles.filterOption} ${currentSourceFilter === 'other' ? styles.active : ''}`}
              onClick={() => onSourceFilter('other')}
            >
              Other
            </button>
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Time Period</label>
          <div className={styles.filterOptions}>
            <button 
              className={`${styles.filterOption} ${currentTimeFilter === 'all' ? styles.active : ''}`}
              onClick={() => onTimeFilter('all')}
            >
              All Time
            </button>
            <button 
              className={`${styles.filterOption} ${currentTimeFilter === 'today' ? styles.active : ''}`}
              onClick={() => onTimeFilter('today')}
            >
              Today
            </button>
            <button 
              className={`${styles.filterOption} ${currentTimeFilter === 'week' ? styles.active : ''}`}
              onClick={() => onTimeFilter('week')}
            >
              This Week
            </button>
            <button 
              className={`${styles.filterOption} ${currentTimeFilter === 'month' ? styles.active : ''}`}
              onClick={() => onTimeFilter('month')}
            >
              This Month
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}