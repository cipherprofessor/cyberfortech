import React from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogSidebar.module.scss';
import { BlogPost } from '@/types/blog';
import AuthorCard from '../AuthorCard/AuthorCard';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import RelatedPosts from '../RelatedPosts/RelatedPosts';
import TrendingPosts from '../TrendingPosts/TrendingPosts';


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
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  author,
  authorPosts,
  trendingPosts,
  currentPostId
}) => {
  const { theme } = useTheme();
  
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