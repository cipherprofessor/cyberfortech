// src/app/(routes)/blog/page.tsx
"use client";

import React, { useEffect } from 'react';
import BlogProvider from '@/contexts/BlogContext';
import BlogList from '@/components/blog/BlogList';
import { useBlog } from '@/contexts/BlogContext';

function BlogContent() {
  const { 
    posts, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    setPage,
    fetchPosts 
  } = useBlog();

  useEffect(() => {
    fetchPosts(1); // Fetch posts when component mounts
  }, [fetchPosts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <a 
          href="/blog/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Post
        </a>
      </div>
      <BlogList 
        posts={posts}
        loading={loading}
        error={error || undefined}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
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