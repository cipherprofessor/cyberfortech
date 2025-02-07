// src/components/TopicsList/TopicsList.tsx
import Image from 'next/image';
import { Pin, Lock, MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Topic } from '@/types/forum';
import styles from './TopicsList.module.scss';

const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

interface TopicsListProps {
  topics: Topic[];
  categoryId: string;
  categoryName?: string;
  loading?: boolean;
}

export function TopicsList({ 
  topics, 
  categoryId, 
  categoryName,
  loading = false 
}: TopicsListProps) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          Loading Topics...
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeletonTopic}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonMeta} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Topics {categoryName && `in ${categoryName}`}
      </div>
      {topics.map(topic => (
        <div 
          key={topic.id} 
          className={styles.topicItem}
        >
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <Image 
                src={topic.author.avatar || '/default-avatar.png'} 
                alt={topic.author.name || 'User'}
                width={40} 
                height={40} 
                className={styles.avatar}
              />
              {topic.isPinned && (
                <Pin 
                  className={`${styles.badge} ${styles.pinBadge}`}
                  size={16} 
                />
              )}
              {topic.isLocked && (
                <Lock 
                  className={`${styles.badge} ${styles.lockBadge}`}
                  size={16} 
                />
              )}
            </div>
          </div>
          
          <div className={styles.contentSection}>
            <div className={styles.topicHeader}>
              <a 
                href={`/forum/topic/${topic.id}`} 
                className={styles.topicTitle}
              >
                {topic.title}
              </a>
              <span className={styles.categoryTag}>
                {topic.category_name}
              </span>
            </div>
            
            <div className={styles.authorInfo}>
              Started by {topic.author.name} 
              {' • '}
              {formatTimestamp(topic.timestamp)}
            </div>
          </div>
          
          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <MessageCircle size={16} />
              <span>{topic.replies}</span>
            </div>
            
            <div className={styles.statItem}>
              <Eye size={16} />
              <span>{topic.views}</span>
            </div>
            
            <div className={styles.lastReply}>
              Last reply by <span>{topic.lastReply.author}</span>
              {' • '}
              {formatTimestamp(topic.lastReply.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}