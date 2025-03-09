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






// src/hooks/useBlogOperations.ts

import axios from 'axios';


export function useBlogOperationsnew() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchPosts } = useBlog();

  /**
   * Create a new blog post
   */
  const handleCreatePost = async (post: Partial<BlogPost>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/blog', post);
      
      // Refresh the posts list
      fetchPosts(1);
      
      // Redirect to the new post
      router.push(`/blog/${response.data.slug}`);
    } catch (err) {
      console.error('Error creating post:', err);
      
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Failed to create post');
      } else {
        setError('An unexpected error occurred');
      }
      
      throw new Error(error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing blog post
   */
  const handleUpdatePost = async (slug: string, post: Partial<BlogPost>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(`/api/blog/${slug}`, post);
      
      // Refresh the posts list
      fetchPosts();
      
      // If the slug changed, redirect to the new URL
      if (response.data.slug !== slug) {
        router.push(`/blog/${response.data.slug}`);
      } else {
        // Otherwise just refresh the current page
        router.refresh();
      }
    } catch (err) {
      console.error('Error updating post:', err);
      
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Failed to update post');
      } else {
        setError('An unexpected error occurred');
      }
      
      throw new Error(error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a blog post
   */
  const handleDeletePost = async (slug: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`/api/blog/${slug}`);
      
      // Refresh the posts list
      fetchPosts(1);
      
      // Redirect to the blog page
      router.push('/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Failed to delete post');
      } else {
        setError('An unexpected error occurred');
      }
      
      throw new Error(error || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost
  };
}