'use client';

import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogSidebar.module.scss';
import { BlogPost } from '@/types/blog';

// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAuthorPosts, fetchTrendingPosts } from '@/store/slices/blogSlice';
import AuthorCard from '../AuthorCard/AuthorCard';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import RelatedPosts from '../RelatedPosts/RelatedPosts';
import RelatedPostsSkeleton from '../RelatedPosts/RelatedPostsSkeleton';
import TrendingPosts from '../TrendingPosts/TrendingPosts';
import TrendingPostsSkeleton from '../TrendingPosts/TrendingPostsSkeleton';

interface BlogSidebarProps {
  author: {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
  };
  currentPostId: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  author,
  currentPostId
}) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  
  // Get state from Redux
  const { 
    authorPosts, 
    trendingPosts,
    loading: { 
      authorPosts: loadingAuthorPosts, 
      trendingPosts: loadingTrendingPosts 
    } 
  } = useAppSelector(state => state.blog);
  
  // Fetch author posts and trending posts
  useEffect(() => {
    if (author.id && currentPostId) {
      // With the updated useAppDispatch, these should now work without errors
      dispatch(fetchAuthorPosts({ 
        authorId: author.id, 
        postId: currentPostId, 
        limit: 3 
      }));
      
      dispatch(fetchTrendingPosts({ 
        limit: 5, 
        excludeId: currentPostId 
      }));
    }
  }, [dispatch, author.id, currentPostId]);
  
  // Create post adapters to handle type compatibility
  const adaptedAuthorPosts = authorPosts.map(post => ({
    ...post,
    // Add any missing properties required by your BlogPost type
    authorId: post.author?.id || '',
    status: post.status || 'published',
    isFeatured: post.isFeatured || false,
    updatedAt: post.updatedAt || new Date(),
    // Add any other missing fields with default values
  }));
  
  const adaptedTrendingPosts = trendingPosts.map(post => ({
    ...post,
    authorId: post.author?.id || '',
    status: post.status || 'published',
    isFeatured: post.isFeatured || false,
    updatedAt: post.updatedAt || new Date(),
    // Add any other missing fields with default values
  }));
  
  return (
    <aside className={clsx(styles.sidebar, theme === 'dark' && styles.dark)}>
      <AuthorCard author={author} />
      
      {loadingAuthorPosts ? (
        <RelatedPostsSkeleton title="More from this Author" count={3} />
      ) : adaptedAuthorPosts.length > 0 && (
        <RelatedPosts 
          title="More from this Author"
          posts={adaptedAuthorPosts as BlogPost[]}
        />
      )}
      
      {loadingTrendingPosts ? (
        <TrendingPostsSkeleton count={5} />
      ) : adaptedTrendingPosts.length > 0 && (
        <TrendingPosts 
          posts={adaptedTrendingPosts as BlogPost[]} 
        />
      )}
      
      <NewsletterSignup />
    </aside>
  );
};

export default BlogSidebar;