import React from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogSidebar.module.scss';
import AuthorCardSkeleton from '../AuthorCard/AuthorCardSkeleton';
import NewsletterSignupSkeleton from '../NewsletterSignup/NewsletterSignupSkeleton';
import RelatedPostsSkeleton from '../RelatedPosts/RelatedPostsSkeleton';
import TrendingPostsSkeleton from '../TrendingPosts/TrendingPostsSkeleton';



const BlogSidebarSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <aside className={clsx(styles.sidebar, theme === 'dark' && styles.dark)}>
      <AuthorCardSkeleton />
      <RelatedPostsSkeleton title="More from this Author" count={3} />
      <TrendingPostsSkeleton count={5} />
      <NewsletterSignupSkeleton />
    </aside>
  );
};

export default BlogSidebarSkeleton;