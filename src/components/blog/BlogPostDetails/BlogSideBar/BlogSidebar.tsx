import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogSidebar.module.scss';
import { BlogPost } from '@/types/blog';
import AuthorCardSkeleton from '../AuthorCard/AuthorCardSkeleton';
import { string } from 'zod';
import AuthorCard from '../AuthorCard/AuthorCard';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import NewsletterSignupSkeleton from '../NewsletterSignup/NewsletterSignupSkeleton';
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
  authorPosts: BlogPost[];
  trendingPosts: BlogPost[];
  currentPostId: string;
  loading?: boolean;
}
currentPostId: string;
    

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  author,
  authorPosts,
  trendingPosts,
  currentPostId,
  loading = false
}) => {
  const { theme } = useTheme();
  
  if (loading) {
    return (
      <aside className={clsx(styles.sidebar, theme === 'dark' && styles.dark)}>
        <AuthorCardSkeleton />
        <RelatedPostsSkeleton title="More from this Author" count={3} />
        <TrendingPostsSkeleton count={5} />
        <NewsletterSignupSkeleton />
      </aside>
    );
  }
  
  return (
    <aside className={clsx(styles.sidebar, theme === 'dark' && styles.dark)}>
      <AuthorCard 
        author={author}
      />
      
      {authorPosts.length > 0 && (
        <RelatedPosts 
          title="More from this Author"
          posts={authorPosts}
        />
      )}
      
      {trendingPosts.length > 0 && (
        <TrendingPosts 
          posts={trendingPosts}
        />
      )}
      
      <NewsletterSignup />
    </aside>
  );
};

export default BlogSidebar;