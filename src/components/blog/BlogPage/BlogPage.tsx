"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PlusCircle, Filter, ArrowUpRight, Search } from 'lucide-react';
import clsx from 'clsx';

import styles from './BlogPage.module.scss';
import { BlogListProps } from '@/types/blog';
import AuthorProfile from '../AuthorProfile/AuthorProfile';
import BlogCard from '../BlogCard/BlogCard';
import BlogCardGrid from '../BlogCardGrid/BlogCardGrid';
import BlogSkeleton from '../BlogCard/CardSkelton/BlogCardSkeleton';
import BlogViewOptions from '../BlogViewOptions/BlogViewOptions';
import PopularTags from '../PopularTags/PopularTags';
import NewsletterSubscribe from '../NewsletterSubscribe/NewsletterSubscribe';
import BlogStats from '../BlogStats/BlogStats';
import BlogAuthorsGrid from '../BlogAuthorsGrid/BlogAuthorsGrid';
import TrendingTopics from '../TrendingTopics/TrendingTopics';

// Mock authors data remains the same

// Transform tags data for the PopularTags component
const transformTags = (tags: Array<any> = []) => {
  return tags.map(tag => ({
    ...tag,
    count: Math.floor(Math.random() * 50) + 1 // Mock count for demonstration
  }));
};

const BlogPage: React.FC<BlogListProps> = ({
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategorySelect = (categorySlug: string) => {
    const newCategory = selectedCategory === categorySlug ? null : categorySlug;
    setSelectedCategory(newCategory);
    if (onCategoryFilter) {
      onCategoryFilter(newCategory);
    }
  };

  const handleTagSelect = (tagSlug: string | null) => {
    setSelectedTag(tagSlug);
    if (onTagFilter) {
      onTagFilter(tagSlug);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleViewChange = (view: 'list' | 'grid') => {
    setViewMode(view);
  };

  // Social links for the author profile
  const socialLinks = [
    { platform: 'Twitter', url: '#', icon: '𝕏' },
    { platform: 'Facebook', url: '#', icon: 'ⓕ' },
    { platform: 'Instagram', url: '#', icon: '📷' },
    { platform: 'LinkedIn', url: '#', icon: 'in' },
  ];

  
  // Convert tags for the popular tags component
  const popularTags = transformTags(tags);

  // Mock authors data for the authors grid
  const mockAuthors = [
    {
      id: '1',
      name: 'Mohsin Manzoor Bhat',
      avatar: '/avatars/mohsin.jpg',
      role: 'LEAD DEVELOPER',
      postCount: 24
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      role: 'SECURITY EXPERT',
      postCount: 18
    },
    {
      id: '3',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      role: 'UI/UX DESIGNER',
      postCount: 15
    },
    {
      id: '4',
      name: 'Jessica Williams',
      avatar: '/avatars/jessica.jpg',
      role: 'DATA SCIENTIST',
      postCount: 12
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: '/avatars/david.jpg',
      role: 'BACKEND DEVELOPER',
      postCount: 9
    },
    {
      id: '6',
      name: 'Emma Martinez',
      avatar: '/avatars/emma.jpg',
      role: 'CONTENT CREATOR',
      postCount: 7
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className={clsx(styles.container, theme === 'dark' && styles.dark, className)}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>
            Heartfelt <span>Reflections</span>: Stories of CyberSecurity, Web Development, and Other Tech.
          </h1>
          <p className={styles.subTitle}>
            Explore fresh perspectives! Discover curated content to enlighten, entertain and engage.
          </p>
        </div>
      </div>

      <TrendingTopics 
  initialCategories={categories}
  selectedCategory={selectedCategory}
  onCategorySelect={handleCategorySelect}
/>

      {/* Action Bar with toggles, search and create post button */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarLeft}>
          <BlogViewOptions
            currentView={viewMode}
            onViewChange={handleViewChange}
          />
        </div>
        
        <div className={styles.searchFilterArea}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
            <button 
              className={styles.searchButton}
              onClick={() => handleSearch(searchQuery)}
            >
              <Search size={16} />
            </button>
          </div>
          
          <div className={styles.filterButton}>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={clsx(
                styles.filterToggle, 
                showFilters && styles.active,
                selectedTag && styles.hasFilter
              )}
            >
              <Filter size={16} />
              <span>Filters</span>
              {selectedTag && <span className={styles.filterBadge}>1</span>}
            </button>
          </div>
        </div>
        
        <Link href="/blog/new" className={styles.createPostButton}>
          <PlusCircle size={18} />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Filters dropdown section */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className={styles.filterTagsContainer}>
            <h3 className={styles.filterTitle}>Filter by Tags</h3>
            <div className={styles.tagsList}>
              {tags.map(tag => (
                <button
                  key={tag.slug}
                  className={clsx(
                    styles.tagButton,
                    selectedTag === tag.slug && styles.active
                  )}
                  onClick={() => handleTagSelect(selectedTag === tag.slug ? null : tag.slug)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content section */}
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
          {/* Main content column with posts */}
          <div className={styles.mainColumn}>
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                // List View
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </motion.div>
              ) : (
                // Grid View
                <motion.div
                  key="grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.gridContainer}
                >
                  {posts.map((post, index) => (
                    <BlogCardGrid 
                      key={post.id} 
                      post={post as any} // Type assertion for TypeScript
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
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
            
            {/* Bottom section with Tags and Authors - AFTER posts */}
            <div className={styles.bottomSection}>
              <h2 className={styles.bottomSectionTitle}>Explore More</h2>
              <div className={styles.bottomWidgets}>
                {/* Popular Tags Component */}
                <PopularTags
                  tags={popularTags}
                  selectedTag={selectedTag}
                  onTagSelect={handleTagSelect}
                />
                
                {/* Popular Authors Component */}
                <BlogAuthorsGrid authors={mockAuthors} />
              </div>
              
              {/* Explore All Link */}
              <div className={styles.exploreAllLink}>
                <Link href="/blog/archive" className={styles.exploreLink}>
                  <span>Explore All Articles</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar on desktop only */}
          <div className={styles.sideColumnDesktop}>
            {/* Author Profile Component */}
            <AuthorProfile 
              name="Mohsin Manzoor Bhat"
              role="REFLECTIVE BLOGGER"
              bio="Mohsin shares thoughtful insights and reflections on life, culture, and personal growth. His work explores the intersections of creativity and experience, offering readers unique perspectives."
              location="Paris, France"
              socialLinks={socialLinks}
            />
            
            {/* Blog Stats Component */}
            <BlogStats
              totalPosts={posts.length}
              totalAuthors={mockAuthors.length}
              totalCategories={categories.length}
              lastUpdated={new Date()} // Use actual last updated date if available
            />
            
            {/* Newsletter Subscribe Component */}
            <NewsletterSubscribe />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;