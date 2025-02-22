// src/app/(routes)/blog/new/page.tsx
"use client";

import React from 'react';
import BlogProvider from '@/contexts/BlogContext';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/blog/BlogEditor';
import { useBlogOperations } from '@/hooks/useBlogOperations';
import { BlogPost } from '@/types/blog';

// Metadata needs to be moved to a separate layout.tsx file since we're using 'use client'
function NewBlogPostContent() {
  const router = useRouter();
  const { handleCreatePost } = useBlogOperations();

  const handleSave = async (post: Partial<BlogPost>) => {
    await handleCreatePost(post);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogEditor 
        onSave={handleSave}
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