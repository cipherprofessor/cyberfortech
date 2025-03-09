// src/app/(dashboard)/blog/page.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

import { BlogPost, BlogCategory, BlogTag } from '@/types/blog';
import BlogPage from '@/components/blog/BlogPage/BlogPage';

export default function BlogPageRoute() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch blog posts
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10'
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        
        if (selectedTag) {
          params.append('tag', selectedTag);
        }
        
        const response = await axios.get(`/api/blog?${params.toString()}`);
        
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/blog/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    // Function to fetch tags
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/blog/tags');
        setTags(response.data);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    // Fetch data
    fetchBlogPosts();
    fetchCategories();
    fetchTags();
  }, [currentPage, searchQuery, selectedCategory, selectedTag]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  
  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <BlogPage
      posts={posts}
      loading={loading}
      error={error || null}
      currentPage={currentPage}
      totalPages={totalPages}
      categories={categories}
      tags={tags}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onCategoryFilter={handleCategoryFilter}
      onTagFilter={handleTagFilter}
    />
  );
}