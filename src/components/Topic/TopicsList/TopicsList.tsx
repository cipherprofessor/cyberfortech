'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Pin, Lock, MessageCircle, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Topic } from '@/types/forum';
import styles from './TopicsList.module.scss';

const formatTimestamp = (timestamp: string | null | undefined) => {
  if (!timestamp) {
    const now = new Date().toISOString();
    return formatDistanceToNow(new Date(now), { addSuffix: true });
  }
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return formatDistanceToNow(new Date(), { addSuffix: true });
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return formatDistanceToNow(new Date(), { addSuffix: true });
  }
};

interface TopicsListProps {
  topics: Topic[];
  categoryId: string;
  categoryName?: string;
  loading?: boolean;
}

const TopicSkeleton = () => (
  <div className={styles.topicItemSkeleton}>
    <div className={styles.avatarSkeleton} />
    <div className={styles.contentSkeleton}>
      <div className={styles.titleSkeleton} />
      <div className={styles.metaSkeleton} />
    </div>
    <div className={styles.statsSkeleton}>
      <div className={styles.statItemSkeleton} />
      <div className={styles.statItemSkeleton} />
      <div className={styles.lastReplySkeleton} />
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

export function TopicsList({ 
  topics, 
  categoryId, 
  categoryName,
  loading = false 
}: TopicsListProps) {
  // Debug logging
  console.log('Received topics:', topics);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Recent Topics in {categoryName || 'Category'}</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <TopicSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Ensure topics is an array and has required fields
  const validTopics = topics.map(topic => {
    console.log('Processing topic:', topic); // Debug individual topic
    return {
      ...topic,
      author_name: topic.author_name || 'Anonymous',
      author_image: topic.author_image || null,
      created_at: topic.created_at || new Date().toISOString(),
      updated_at: topic.updated_at || new Date().toISOString(),
      reply_count: Number(topic.reply_count) || 0,
      views: Number(topic.views) || 0,
      title: topic.title || 'Untitled Topic'
    };
  });

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <h2>Recent Topics in {categoryName || 'Category'}</h2>
      </div>

      {validTopics.map((topic) => (
        <motion.div 
          key={topic.id}
          className={styles.topicItem}
          variants={itemVariants}
        >
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {topic.author_image ? (
                <Image 
                  src={topic.author_image}
                  alt={topic.author_name}
                  width={40} 
                  height={40} 
                  className={styles.avatar}
                  unoptimized
                />
              ) : (
                <div className={`${styles.avatar} ${styles.defaultAvatar}`}>
                  {topic.author_name[0].toUpperCase()}
                </div>
              )}
              {topic.is_pinned && (
                <Pin className={`${styles.badge} ${styles.pinBadge}`} size={16} />
              )}
              {topic.is_locked && (
                <Lock className={`${styles.badge} ${styles.lockBadge}`} size={16} />
              )}
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.topicHeader}>
              <a 
                href={`/forum/topics/${topic.id}`} 
                className={styles.topicTitle}
              >
                {topic.title}
              </a>
              {topic.category_name && (
                <span className={styles.categoryTag}>
                  {topic.category_name}
                </span>
              )}
            </div>
            
            <div className={styles.authorInfo}>
            Created By {' '}
              <span className={styles.authorName}>
                {topic.author_name}
              </span>
              {' • '}
              <Clock size={12} className={styles.timeIcon} />
              {formatTimestamp(topic.created_at)}
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statsGroup}>
              <div className={styles.statItem}>
                <MessageCircle size={14} />
                <span>{topic.reply_count}</span>
                <span className={styles.statLabel}>Replies</span>
              </div>
              
              <div className={styles.statItem}>
                <Eye size={14} />
                <span>{topic.views}</span>
                <span className={styles.statLabel}>Views</span>
              </div>
            </div>
            
            <div className={styles.lastReply}>
              <div className={styles.lastReplyHeader}>Last Activity</div>
              <div className={styles.lastReplyInfo}>
                <span className={styles.lastReplyTime}>
                  {formatTimestamp(topic.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {validTopics.length === 0 && (
        <div className={styles.noTopics}>
          No topics found in this category yet.
        </div>
      )}
    </motion.div>
  );
}