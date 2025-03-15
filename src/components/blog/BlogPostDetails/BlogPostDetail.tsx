// src/components/blog/BlogPostDetails/BlogPostDetail.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogPostDetail.module.scss';
import { BlogPost } from '@/types/blog';

import { toast } from 'sonner';
import Comments from '@/app/api/blog/comments/Comments';

// Import components
import BlogPostDetailSkeleton from './BlogPostDetailSkeleton';


// Import Redux hooks and action
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetBlogState } from '@/store/slices/blogSlice';
import BlogActions from './BlogActions/BlogActions';
import BlogSidebar from './BlogSideBar/BlogSidebar';
import PostMeta from './PostMeta/PostMeta';
import PostTaxonomy from './PostTaxonomy/PostTaxonomy';

interface BlogPostDetailProps {
  post: BlogPost;
  currentUserRole?: string;
  isAuthor?: boolean;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  post,
  currentUserRole,
  isAuthor
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [readingTime] = useState(
    Math.ceil(post.content.split(' ').length / 200)
  );

  // Reset blog state when component unmounts
  useEffect(() => {
    setMounted(true);
    
    return () => {
      dispatch(resetBlogState());
    };
  }, [dispatch]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <BlogPostDetailSkeleton />;
    // return null;
  }

  return (
    <div className={clsx(styles.pageContainer, theme === 'dark' && styles.dark)} suppressHydrationWarning>
      <div className={styles.contentWrapper}>
        {/* Main Content */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.mainContent}
        >
          {/* Featured Image */}
          {post.featuredImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.featuredImage}
            >
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={1200}
                height={600}
                className={styles.image}
                priority
              />
            </motion.div>
          )}

          {/* Hero Section */}
          <div className={styles.hero}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.title}
            >
              {post.title}
            </motion.h1>

            <PostMeta 
              author={post.author}
              publishedAt={post.publishedAt || post.createdAt}
              readingTime={readingTime}
              viewCount={post.viewCount}
            />

            <BlogActions
              postId={post.id}
              postSlug={post.slug}
              postTitle={post.title}
              isAuthor={isAuthor}
              currentUserRole={currentUserRole} 
              currentUserId={post.author.id} // or use actual current user ID from auth context
            />
          </div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={styles.content}
          >
            {post.excerpt && (
              <p className={styles.excerpt}>{post.excerpt}</p>
            )}

            <div 
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Tags and Categories */}
          <PostTaxonomy 
            categories={post.categories}
            tags={post.tags}
          />



{/* Comments Section */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.6,
    delay: 0.5,
    ease: "easeOut"
  }}
  className={styles.commentsWrapper}
>
  <h3 className={styles.commentsTitle}>
    <MessageCircle size={18} />
    Comments
  </h3>
  <Comments postId={post.id} />
</motion.div>
</motion.article>

{/* Sidebar */}
<BlogSidebar 
author={post.author}
currentPostId={post.id}
/>
</div>
</div>
);
};

export default BlogPostDetail;