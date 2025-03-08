// src/app/(routes)/blog/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import BlogProvider from '@/contexts/BlogContext';
import BlogList from '@/components/blog/BlogList';
import { useBlog } from '@/contexts/BlogContext';
import { Moon, Sun } from 'lucide-react';
import styles from './BlogPage.module.scss';
import clsx from 'clsx';

// This is the content component that uses the BlogContext
function BlogContent() {
  const { 
    posts, 
    categories,
    tags,
    loading, 
    error, 
    currentPage, 
    totalPages, 
    setPage,
    setSearchQuery,
    setCategoryFilter,
    setTagFilter,
    fetchPosts 
  } = useBlog();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPosts(1); // Fetch posts when component mounts
  }, [fetchPosts]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={clsx(styles.pageContainer, theme === 'dark' && styles.dark)}>
      <div className={styles.themeToggleWrapper}>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggle}
          aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={styles.contentWrapper}>
        <BlogList 
          posts={posts}
          loading={loading}
          error={error || undefined}
          currentPage={currentPage}
          totalPages={totalPages}
          categories={categories}
          tags={tags}
          onPageChange={setPage}
          onSearch={setSearchQuery}
          onCategoryFilter={setCategoryFilter}
          onTagFilter={setTagFilter}
        />
      </div>
    </div>
  );
}

// This is the main page component that provides the BlogContext
export default function BlogPage() {
  return (
    <BlogProvider>
      <BlogContent />
    </BlogProvider>
  );
}