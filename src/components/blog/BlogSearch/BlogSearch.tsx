// src/components/blog/BlogSearch/index.tsx
"use client";

import React, { useState } from 'react';
import { Search, X, FilterIcon, ChevronUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { BlogTag } from '@/types/blog';
import styles from './BlogSearch.module.scss';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  onTagFilter?: (tag: string | null) => void;
  tags?: BlogTag[];
  selectedTag?: string | null;
  className?: string;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  onTagFilter,
  tags = [],
  selectedTag = null,
  className,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleTagSelect = (tagSlug: string) => {
    const newTag = selectedTag === tagSlug ? null : tagSlug;
    if (onTagFilter) {
      onTagFilter(newTag);
    }
  };

  const clearFilters = () => {
    if (onTagFilter) {
      onTagFilter(null);
    }
  };

  return (
    <div className={clsx(styles.container, theme === 'dark' && styles.dark, className)}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInput}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchField}
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      {tags && tags.length > 0 && (
        <div className={styles.filterControls}>
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <FilterIcon size={18} />
            <span>Filters</span>
            <span className={clsx(styles.filterArrow, showFilters && styles.open)}>
              <ChevronUp size={18} />
            </span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.filterDropdown}
              >
                <div className={styles.filterGroup}>
                  <h3 className={styles.filterHeading}>Tags</h3>
                  <div className={styles.filterOptions}>
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        className={clsx(
                          styles.filterChip,
                          selectedTag === tag.slug && styles.active
                        )}
                        onClick={() => handleTagSelect(tag.slug)}
                        aria-pressed={selectedTag === tag.slug}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTag && (
                  <button 
                    className={styles.clearFiltersButton}
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BlogSearch;