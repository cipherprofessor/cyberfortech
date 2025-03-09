// src/app/(routes)/blog/page.tsx
"use client";

import React from 'react';
import BlogList from '@/components/blog/BlogPage/BlogPage';
import BlogProvider, { useBlog } from '@/contexts/BlogContext';

function BlogPageContent() {
  const { posts, loading, error, currentPage, totalPages, setPage } = useBlog();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <BlogList
        posts={posts}
        loading={loading}
        error={error || undefined}  // Convert null to undefined
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
      <BlogPageContent />
    </BlogProvider>
  );
}