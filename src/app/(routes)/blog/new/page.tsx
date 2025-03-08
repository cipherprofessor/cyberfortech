// src/app/(routes)/blog/new/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

import { useBlogOperations } from '@/hooks/useBlogOperations';

import BlogEditor from '@/components/blog/BlogEditor';
import BlogProvider from '@/contexts/BlogContext';


function NewBlogPostContent() {
  const router = useRouter();
  const { handleCreatePost } = useBlogOperations();

  const handleCancel = () => {
    router.push('/blog');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogEditor 
        onSave={handleCreatePost}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default function NewBlogPostPage() {
  return (
    <BlogProvider>
      <NewBlogPostContent />
    </BlogProvider>
  );
}