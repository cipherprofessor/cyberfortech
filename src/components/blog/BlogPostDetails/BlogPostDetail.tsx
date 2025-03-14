"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Tag,
  BookOpen,
  Share2,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  Edit,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './BlogPostDetail.module.scss';
import { BlogPost } from '@/types/blog';

import { toast } from 'sonner';
import Comments from '@/app/api/blog/comments/Comments';
import BlogSidebar from './BlogSideBar/BlogSidebar';
import PostActions from './PostActions/PostActions';
import PostMeta from './PostMeta/PostMeta';
import PostTaxonomy from './PostTaxonomy/PostTaxonomy';

// Import components


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
  const [mounted, setMounted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [readingTime] = useState(
    Math.ceil(post.content.split(' ').length / 200)
  );
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Fetch author's other posts
    const fetchAuthorPosts = async () => {
      try {
        const response = await fetch(`/api/blog/author/${post.author.id}/posts?limit=3&exclude=${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching author posts:', error);
      }
    };

    // Fetch trending posts
    const fetchTrendingPosts = async () => {
      try {
        const response = await fetch(`/api/blog/trending?limit=5&exclude=${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setTrendingPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      }
    };

    fetchAuthorPosts();
    fetchTrendingPosts();
  }, [post.id, post.author.id]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/blog/${post.slug}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/blog/${post.slug}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/blog');
          router.refresh();
        } else {
          throw new Error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    toast.success('Thanks for liking this post!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className={clsx(styles.pageContainer, theme === 'dark' && styles.dark)}>
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

            <PostActions 
              isAuthor={isAuthor}
              currentUserRole={currentUserRole}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBookmark={handleBookmark}
              isBookmarked={isBookmarked}
              likeCount={likeCount}
              onLike={handleLike}
              onShare={handleShare}
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
          authorPosts={authorPosts}
          trendingPosts={trendingPosts}
          currentPostId={post.id}
        />
      </div>
    </div>
  );
};

export default BlogPostDetail;