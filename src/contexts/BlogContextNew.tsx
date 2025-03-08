// src/contexts/BlogContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { BlogPost, BlogCategory, BlogTag, BlogPaginationResponse } from '@/types/blog';

interface BlogContextProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  selectedTag: string | null;
  fetchPosts: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  setTagFilter: (tag: string | null) => void;
  clearFilters: () => void;
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchPosts = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      
      const response = await axios.get<BlogPaginationResponse>(`/api/blog?${params.toString()}`);
      
      setPosts(response.data.posts);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      setHasMore(response.data.pagination.hasMore);
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, selectedTag]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get<BlogCategory[]>('/api/blog/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Don't set error state as this is secondary data
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await axios.get<BlogTag[]>('/api/blog/tags');
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
      // Don't set error state as this is secondary data
    }
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchPosts(page);
  }, [fetchPosts]);

  const setSearchQueryAndFetch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
    // fetchPosts will be called via useEffect
  }, []);

  const setCategoryFilter = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
    // fetchPosts will be called via useEffect
  }, []);

  const setTagFilter = useCallback((tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1); // Reset to first page
    // fetchPosts will be called via useEffect
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
    setCurrentPage(1); // Reset to first page
    // fetchPosts will be called via useEffect
  }, []);

  // Fetch posts whenever filters change
  useEffect(() => {
    fetchPosts(currentPage);
  }, [fetchPosts, currentPage, searchQuery, selectedCategory, selectedTag]);

  // Fetch categories and tags on initial load
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  const value = {
    posts,
    categories,
    tags,
    loading,
    error,
    currentPage,
    totalPages,
    hasMore,
    searchQuery,
    selectedCategory,
    selectedTag,
    fetchPosts,
    fetchCategories,
    fetchTags,
    setPage,
    setSearchQuery: setSearchQueryAndFetch,
    setCategoryFilter,
    setTagFilter,
    clearFilters,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = (): BlogContextProps => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export default BlogProvider;