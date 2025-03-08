// src/components/blog/BlogList/index.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PlusCircle, Search, X, FilterIcon, ChevronUp } from 'lucide-react';

import BlogCard from '../BlogCard';
import BlogSkeleton from '../BlogSkeleton';
import clsx from 'clsx';
import styles from './BlogList.module.scss';
import { BlogListProps } from '@/types/blog';


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
  const { theme } = useTheme();
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
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>
            Heartfelt <span>Reflections</span>: Stories of Love, Loss, and Growth
          </h1>
          <p className={styles.subTitle}>
            Explore fresh perspectives! Discover curated content to enlighten, entertain and engage.
          </p>
        </div>
      </div>

      <div className={styles.topicsSection}>
        <h2 className={styles.sectionTitle}>EXPLORE TRENDING TOPICS</h2>
        
        <div className={styles.topicsGrid}>
          {categories.map(category => (
            <button
              key={category.id}
              className={clsx(
                styles.topicButton,
                selectedCategory === category.slug && styles.active
              )}
              onClick={() => handleCategorySelect(category.slug)}
            >
              <span className={styles.topicIcon}>📱</span>
              <span className={styles.topicName}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchAndFilters}>
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
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={18} />
            <span>Filters</span>
            <span className={clsx(styles.filterArrow, showFilters && styles.open)}>
              <ChevronUp size={18} />
            </span>
          </button>

          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.filterDropdown}
            >
              {tags?.length > 0 && (
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
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonList}>
          <BlogSkeleton count={5} />
        </div>
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
            <PlusCircle size={18} />
            <span>Create New Post</span>
          </Link>
        </div>
      ) : (
        <div className={styles.contentSection}>
          <div className={styles.mainColumn}>
            <AnimatePresence mode="wait">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </AnimatePresence>

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

          <div className={styles.sideColumn}>
            <div className={styles.authorSection}>
              <h3 className={styles.sectionHeading}>ABOUT</h3>
              
              <div className={styles.authorProfile}>
                <div className={styles.authorAvatar}>
                  <img 
                    src="/api/placeholder/80/80" 
                    alt="Author" 
                    className={styles.avatarImage} 
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>Ethan Caldwell</h4>
                  <p className={styles.authorRole}>REFLECTIVE BLOGGER</p>
                </div>
              </div>
              
              <p className={styles.authorBio}>
                Ethan Caldwell shares thoughtful insights and reflections on life, culture, and personal growth. His work explores the intersections of creativity and experience, offering readers unique perspectives.
              </p>
              
              <div className={styles.authorLocation}>
                <span className={styles.locationIcon}>📍</span>
                <span>Paris, France</span>
              </div>
              
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>𝕏</a>
                <a href="#" className={styles.socialLink}>ⓕ</a>
                <a href="#" className={styles.socialLink}>📷</a>
                <a href="#" className={styles.socialLink}>in</a>
              </div>
            </div>
            
            <div className={styles.featuredSection}>
              <h3 className={styles.sectionHeading}>FEATURED POSTS</h3>
              
              <div className={styles.featuredPost}>
                <div className={styles.featuredImage}>
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="AI in Business Management" 
                    className={styles.featuredPostImage} 
                  />
                  <span className={styles.featuredLabel}>MANAGEMENT</span>
                </div>
                <h4 className={styles.featuredTitle}>
                  <a href="#">AI in Business Management: Improving Efficiency and Decision Making</a>
                </h4>
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredAuthor}>Ethan Caldwell</span>
                  <span className={styles.featuredDate}>on July 7, 2024</span>
                </div>
              </div>
            </div>
            
            <div className={styles.createPostButton}>
              <Link href="/blog/new">
                <PlusCircle size={18} />
                <span>Create New Post</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;