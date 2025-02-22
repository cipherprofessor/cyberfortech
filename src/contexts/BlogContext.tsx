// src/contexts/BlogContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import axios from 'axios';
import { BlogPost } from '@/types/blog';

interface BlogState {
  posts: BlogPost[];
  categories: any[];
  tags: any[];
  loading: boolean;
  error: string | undefined;
  currentPage: number;
  totalPages: number;
  selectedCategories: string[];
  selectedTags: string[];
  searchQuery: string;
}

type BlogAction =
  | { type: 'SET_POSTS'; payload: { posts: BlogPost[]; totalPages: number } }
  | { type: 'SET_CATEGORIES'; payload: any[] }
  | { type: 'SET_TAGS'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SELECTED_CATEGORIES'; payload: string[] }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

interface BlogContextType extends BlogState {
  fetchPosts: (page?: number) => Promise<void>;
  createPost: (post: Partial<BlogPost>) => Promise<string>;
  updatePost: (slug: string, post: Partial<BlogPost>) => Promise<string>;
  deletePost: (slug: string) => Promise<void>;
  setPage: (page: number) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
}

const initialState: BlogState = {
  posts: [],
  categories: [],
  tags: [],
  loading: false,
  error: undefined,
  currentPage: 1,
  totalPages: 1,
  selectedCategories: [],
  selectedTags: [],
  searchQuery: ''
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload.posts,
        totalPages: action.payload.totalPages
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
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    default:
      return state;
  }
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (state.selectedCategories.length > 0) {
        params.append('category', state.selectedCategories.join(','));
      }

      if (state.selectedTags.length > 0) {
        params.append('tag', state.selectedTags.join(','));
      }

      if (state.searchQuery) {
        params.append('search', state.searchQuery);
      }

      const response = await axios.get(`/api/blog?${params.toString()}`);
      dispatch({
        type: 'SET_POSTS',
        payload: {
          posts: response.data.posts,
          totalPages: response.data.pagination.totalPages
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch posts'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.selectedCategories, state.selectedTags, state.searchQuery]);

  const createPost = useCallback(async (post: Partial<BlogPost>): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/api/blog', post);
      await fetchPosts(1);
      return response.data.slug;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchPosts]);

  const updatePost = useCallback(async (slug: string, post: Partial<BlogPost>): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put(`/api/blog/${slug}`, post);
      await fetchPosts(state.currentPage);
      return response.data.slug;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchPosts, state.currentPage]);

  const deletePost = useCallback(async (slug: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`/api/blog/${slug}`);
      await fetchPosts(state.currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchPosts, state.currentPage]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    fetchPosts(page);
  }, [fetchPosts]);

  const setSelectedCategories = useCallback((categories: string[]) => {
    dispatch({ type: 'SET_SELECTED_CATEGORIES', payload: categories });
    fetchPosts(1);
  }, [fetchPosts]);

  const setSelectedTags = useCallback((tags: string[]) => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
    fetchPosts(1);
  }, [fetchPosts]);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    // Fetch categories and tags on mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/blog/categories');
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/blog/tags');
        dispatch({ type: 'SET_TAGS', payload: response.data });
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const value = {
    ...state,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    setPage,
    setSelectedCategories,
    setSelectedTags,
    setSearchQuery
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}

export default BlogProvider;