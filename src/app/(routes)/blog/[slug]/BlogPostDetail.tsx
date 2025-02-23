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

import { Toast } from '@radix-ui/react-toast';
import { toast } from 'sonner';
import Comments from '@/app/api/blog/comments/Comments';


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
  const { theme} = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [readingTime] = useState(
    Math.ceil(post.content.split(' ').length / 200)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <article className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </article>
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
        alert('Failed to delete post');
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setLikeCount(prev => prev + 1);
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
    }
  };

  return (
    <article className={clsx(styles.container, theme === 'dark' && styles.dark)}>
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

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.metadata}
        >
          <div className={styles.authorInfo}>
            {post.author.avatarUrl && (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.fullName || 'Author'}
                width={40}
                height={40}
                className={styles.authorAvatar}
              />
            )}
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>
                By {post.author.fullName || 'Anonymous'}
              </span>
              <div className={styles.postMeta}>
                <span className={styles.metaItem}>
                  <Calendar size={14} />
                  {format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}
                </span>
                <span className={styles.metaItem}>
                  <Clock size={14} />
                  {format(new Date(post.publishedAt || post.createdAt), 'HH:mm')}
                </span>
                <span className={styles.metaItem}>
                  <BookOpen size={14} />
                  {readingTime} min read
                </span>
                <span className={styles.metaItem}>
                  <Eye size={14} />
                  {post.viewCount} views
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            {(isAuthor || currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
              <div className={styles.adminActions}>
                <button onClick={handleEdit} className={clsx(styles.actionButton, styles.editButton)}>
                  <Edit size={18} />
                  Edit
                </button>
                <button onClick={handleDelete} className={clsx(styles.actionButton, styles.deleteButton)}>
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
            {/* <div className={styles.userActions}>
              <button 
                onClick={handleLike}
                className={clsx(styles.actionButton, likeCount > 0 && styles.liked)}
              >
                <ThumbsUp size={18} />
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              <button 
                onClick={handleBookmark}
                className={clsx(styles.actionButton, isBookmarked && styles.bookmarked)}
              >
                <Bookmark size={18} />
              </button>
              <button onClick={handleShare} className={styles.actionButton}>
                <Share2 size={18} />
              </button>
            </div> */}
          </div>
        </motion.div>
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={styles.taxonomy}
      >
        {post.categories.length > 0 && (
          <div className={styles.categories}>
            <h3>Categories</h3>
            <div className={styles.tagList}>
              {post.categories.map(category => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className={styles.categoryLink}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className={styles.tags}>
            <h3>Tags</h3>
            <div className={styles.tagList}>
              {post.tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className={styles.tagLink}
                >
                  <Tag size={14} />
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>

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
        <Comments
          postId={post.id}
          onCommentAdded={(comment) => {
            console.log('New comment added:', comment);
          }}
          onCommentDeleted={(commentId) => {
            console.log('Comment deleted:', commentId);
          }}
        />
      </motion.div>
      
    </article>
  );
};

export default BlogPostDetail;