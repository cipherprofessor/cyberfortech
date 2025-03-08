// src/app/(routes)/blog/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';



import { Moon, Sun } from 'lucide-react';
import styles from './BlogPage.module.scss';
import clsx from 'clsx';
import BlogList from '@/components/blog/BlogList/index';
import BlogProvider, { useBlog } from '@/contexts/BlogContext';


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
  const [mounted, setMounted] = useState(false);

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

export default function BlogPage() {
  return (
    <BlogProvider>
      <BlogContent />
    </BlogProvider>
  );
}