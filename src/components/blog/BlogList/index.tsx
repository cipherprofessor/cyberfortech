// src/components/blog/BlogList/index.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PlusCircle, Filter, Search, X } from 'lucide-react';
import { BlogListProps, BlogCategory, BlogTag } from '@/types/blognew';
import BlogCard from '../BlogCard';

import clsx from 'clsx';
import styles from './BlogList.module.scss';
import BlogSkeleton from '../BlogSkeleton';



const BlogList: React.FC<BlogListProps> = ({
  posts,
  loading,
  error,
  currentPage = 1,
  totalPages = 1,
  categories = [],
  tags = [],
  onPageChange,
  onSearch,
  onCategoryFilter,
  onTagFilter,
  className
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  const handleCategorySelect = (categorySlug: string) => {
    const newCategory = selectedCategory === categorySlug ? null : categorySlug;
    setSelectedCategory(newCategory);
    onCategoryFilter?.(newCategory);
  };

  const handleTagSelect = (tagSlug: string) => {
    const newTag = selectedTag === tagSlug ? null : tagSlug;
    setSelectedTag(newTag);
    onTagFilter?.(newTag);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    onCategoryFilter?.(null);
    onTagFilter?.(null);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={clsx(styles.container, theme === 'dark' && styles.dark, className)}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.mainTitle}>Blog Posts</h1>
          <p className={styles.subTitle}>Share your knowledge with the world</p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
          
          <Link href="/blog/new" className={styles.createButton}>
            <PlusCircle size={18} />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      <div className={clsx(styles.filtersRow, showFilters && styles.show)}>
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

        <div className={styles.filterControls}>
          {categories?.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Categories</label>
              <div className={styles.filterOptions}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={clsx(
                      styles.filterChip,
                      selectedCategory === category.slug && styles.active
                    )}
                    onClick={() => handleCategorySelect(category.slug)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tags?.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Tags</label>
              <div className={styles.filterOptions}>
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    className={clsx(
                      styles.filterChip,
                      selectedTag === tag.slug && styles.active
                    )}
                    onClick={() => handleTagSelect(tag.slug)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(selectedCategory || selectedTag) && (
            <button 
              className={styles.clearFiltersButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <BlogSkeleton count={5} className={styles.skeletonList} />
      ) : error ? (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          <button 
            onClick={() => onPageChange?.(1)}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <h3>No blog posts found</h3>
          <p>Get started by creating your first blog post!</p>
          <Link href="/blog/new" className={styles.createEmptyButton}>
            Create New Post
          </Link>
        </div>
      ) : (
        <div className={styles.postList}>
          <AnimatePresence mode="wait">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
            aria-label="Previous page"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={clsx(
                styles.pageButton,
                page === currentPage && styles.active
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;