// src/contexts/BlogContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { BlogPost, BlogCategory, BlogTag, BlogPaginationResponse } from '@/types/blog';

/**
 * Blog state interface
 */
interface BlogState {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  selectedCategories: string[];
  selectedTags: string[];
  selectedCategory: string | null;
  selectedTag: string | null;
  searchQuery: string;
}

/**
 * Blog action types
 */
type BlogAction =
  | { type: 'SET_POSTS'; payload: { posts: BlogPost[]; totalPages: number; hasMore: boolean } }
  | { type: 'SET_CATEGORIES'; payload: BlogCategory[] }
  | { type: 'SET_TAGS'; payload: BlogTag[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SELECTED_CATEGORIES'; payload: string[] }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_SELECTED_TAG'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_FILTERS' };

/**
 * BlogContext interface with all functions
 */
interface BlogContextProps extends BlogState {
  fetchPosts: (page?: number) => Promise<void>;
  createPost: (post: Partial<BlogPost>) => Promise<string>;
  updatePost: (slug: string, post: Partial<BlogPost>) => Promise<string>;
  deletePost: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  setPage: (page: number) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  setTagFilter: (tag: string | null) => void;
  clearFilters: () => void;
}

/**
 * Initial state
 */
const initialState: BlogState = {
  posts: [],
  categories: [],
  tags: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  selectedCategories: [],
  selectedTags: [],
  selectedCategory: null,
  selectedTag: null,
  searchQuery: ''
};

/**
 * Create context with undefined default value
 */
const BlogContext = createContext<BlogContextProps | undefined>(undefined);

/**
 * Blog reducer for managing state changes
 */
function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload.posts,
        totalPages: action.payload.totalPages,
        hasMore: action.payload.hasMore
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_TAGS':
      return {
        ...state,
        tags: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    case 'SET_SELECTED_CATEGORIES':
      return {
        ...state,
        selectedCategories: action.payload
      };
    case 'SET_SELECTED_TAGS':
      return {
        ...state,
        selectedTags: action.payload
      };
    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload
      };
    case 'SET_SELECTED_TAG':
      return {
        ...state,
        selectedTag: action.payload
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        selectedCategories: [],
        selectedTags: [],
        selectedCategory: null,
        selectedTag: null,
        searchQuery: '',
        currentPage: 1
      };
    default:
      return state;
  }
}

interface BlogProviderProps {
  children: ReactNode;
}

/**
 * Blog Provider component
 */
export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  /**
   * Fetch blog posts with pagination and filtering
   */
  const fetchPosts = useCallback(async (page = state.currentPage) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      // Apply filters from both implementations
      if (state.selectedCategories.length > 0) {
        params.append('categories', state.selectedCategories.join(','));
      }
      
      if (state.selectedCategory) {
        params.append('category', state.selectedCategory);
      }

      if (state.selectedTags.length > 0) {
        params.append('tags', state.selectedTags.join(','));
      }
      
      if (state.selectedTag) {
        params.append('tag', state.selectedTag);
      }

      if (state.searchQuery) {
        params.append('search', state.searchQuery);
      }

      const response = await axios.get<BlogPaginationResponse>(`/api/blog?${params.toString()}`);
      
      dispatch({
        type: 'SET_POSTS',
        payload: {
          posts: response.data.posts,
          totalPages: response.data.pagination.totalPages,
          hasMore: response.data.pagination.hasMore
        }
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load blog posts. Please try again later.'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [
    state.currentPage,
    state.selectedCategories,
    state.selectedCategory,
    state.selectedTags,
    state.selectedTag,
    state.searchQuery
  ]);

  /**
   * Create a new blog post
   */
  const createPost = useCallback(async (post: Partial<BlogPost>): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/api/blog', post);
      await fetchPosts(1); // Refresh posts after creation
      return response.data.slug;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchPosts]);

  /**
   * Update an existing blog post
   */
  const updatePost = useCallback(async (slug: string, post: Partial<BlogPost>): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put(`/api/blog/${slug}`, post);
      await fetchPosts(state.currentPage); // Refresh posts after update
      return response.data.slug;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchPosts, state.currentPage]);

  /**
   * Delete a blog post
   */
  const deletePost = useCallback(async (slug: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`/api/blog/${slug}`);
      await fetchPosts(state.currentPage); // Refresh posts after deletion
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchPosts, state.currentPage]);

  /**
   * Fetch blog categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get<BlogCategory[]>('/api/blog/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Don't set error state as this is secondary data
    }
  }, []);

  /**
   * Fetch blog tags
   */
  const fetchTags = useCallback(async () => {
    try {
      const response = await axios.get<BlogTag[]>('/api/blog/tags');
      dispatch({ type: 'SET_TAGS', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      // Don't set error state as this is secondary data
    }
  }, []);

  /**
   * Set current page and fetch posts
   */
  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    fetchPosts(page);
  }, [fetchPosts]);

  /**
   * Set selected categories and reset to page 1
   */
  const setSelectedCategories = useCallback((categories: string[]) => {
    dispatch({ type: 'SET_SELECTED_CATEGORIES', payload: categories });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    fetchPosts(1);
  }, [fetchPosts]);

  /**
   * Set selected tags and reset to page 1
   */
  const setSelectedTags = useCallback((tags: string[]) => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    fetchPosts(1);
  }, [fetchPosts]);

  /**
   * Set single category filter and reset to page 1
   */
  const setCategoryFilter = useCallback((category: string | null) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    fetchPosts(1);
  }, [fetchPosts]);

  /**
   * Set single tag filter and reset to page 1
   */
  const setTagFilter = useCallback((tag: string | null) => {
    dispatch({ type: 'SET_SELECTED_TAG', payload: tag });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    fetchPosts(1);
  }, [fetchPosts]);

  /**
   * Set search query and reset to page 1
   */
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    fetchPosts(1);
  }, [fetchPosts]);

  /**
   * Clear all filters and reset to page 1
   */
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
    fetchPosts(1);
  }, [fetchPosts]);

  // Fetch categories and tags on mount
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  // Create context value with all state and functions
  const value: BlogContextProps = {
    ...state,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    fetchCategories,
    fetchTags,
    setPage,
    setSelectedCategories,
    setSelectedTags,
    setSearchQuery,
    setCategoryFilter,
    setTagFilter,
    clearFilters
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

/**
 * Custom hook to use the blog context
 */
export const useBlog = (): BlogContextProps => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export default BlogProvider;