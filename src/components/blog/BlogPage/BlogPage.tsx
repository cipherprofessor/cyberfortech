// src/components/blog/BlogPage/BlogPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';


import clsx from 'clsx';
import styles from './BlogPage.module.scss';
import { BlogListProps } from '@/types/blog';
import AuthorProfile from '../AuthorProfile/AuthorProfile';
import BlogCard from '../BlogCard/BlogCard';
import BlogSkeleton from '../BlogCard/CardSkelton/BlogCardSkeleton';
import BlogSearch from '../BlogSearch/BlogSearch';
import FeaturedPosts from '../FeaturedPosts/FeaturedPosts';
import TrendingTopics from '../TrendingTopics/TrendingTopics';

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
    if (onSearch) {
      onSearch(query);
    }
  };

  // Social links for the author profile
  const socialLinks = [
    { platform: 'Twitter', url: '#', icon: '𝕏' },
    { platform: 'Facebook', url: '#', icon: 'ⓕ' },
    { platform: 'Instagram', url: '#', icon: '📷' },
    { platform: 'LinkedIn', url: '#', icon: 'in' },
  ];

  // Get featured posts (first 2 featured posts)
  const featuredPosts = posts.filter(post => post.isFeatured).slice(0, 2);

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

      {/* Trending Topics Component */}
      <TrendingTopics 
        initialCategories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Search and Filters Component */}
      <BlogSearch 
        onSearch={handleSearch}
        onTagFilter={handleTagSelect}
        tags={tags}
        selectedTag={selectedTag}
      />

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
            {/* Author Profile Component */}
            <AuthorProfile 
              name="Ethan Caldwell"
              role="REFLECTIVE BLOGGER"
              bio="Ethan Caldwell shares thoughtful insights and reflections on life, culture, and personal growth. His work explores the intersections of creativity and experience, offering readers unique perspectives."
              location="Paris, France"
              socialLinks={socialLinks}
            />
            
            {/* Featured Posts Component */}
            <FeaturedPosts posts={featuredPosts} />
            
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

export default BlogPage;