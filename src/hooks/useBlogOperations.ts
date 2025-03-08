// src/hooks/useBlogOperations.ts
import { useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useBlog } from '@/contexts/BlogContext';
import { BlogPost } from '@/types/blog';


export const useBlogOperations = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    createPost,
    updatePost,
    deletePost,
    loading
  } = useBlog();
  
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = useCallback(async (post: Partial<BlogPost>) => {
    try {
      setLocalLoading(true);
      setError(null);
      if (!createPost) {
        throw new Error('createPost is undefined');
      }
      const slug = await createPost(post);
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      router.push(`/blog/${slug}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create blog post';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLocalLoading(false);
    }
  }, [createPost, router, toast]);

  const handleUpdatePost = useCallback(async (slug: string, post: Partial<BlogPost>) => {
    try {
      setLocalLoading(true);
      setError(null);
      if (!updatePost) {
        throw new Error('updatePost is undefined');
      }
      const newSlug = await updatePost(slug, post);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      if (slug !== newSlug) {
        router.push(`/blog/${newSlug}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update blog post';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLocalLoading(false);
    }
  }, [updatePost, router, toast]);

  const handleDeletePost = useCallback(async (slug: string) => {
    try {
      setLocalLoading(true);
      setError(null);
      if (!deletePost) {
        throw new Error('deletePost is undefined');
      }
      await deletePost(slug);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      router.push('/blog');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog post';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLocalLoading(false);
    }
  }, [deletePost, router, toast]);

  return {
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    loading: loading || localLoading,
    error
  };
};