// src/components/Forum/TopicContent/TopicContent.tsx
'use client';

import { useState } from 'react';
import { User, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './TopicContent.module.scss';

interface TopicContentProps {
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    joinedDate: string;
    postCount: number;
  };
  metadata: {
    createdAt: string;
    lastEdited?: string;
    likes: number;
    hasLiked: boolean;
  };
  onLike: () => void;
}

export function TopicContent({ content, author, metadata, onLike }: TopicContentProps) {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(metadata.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={styles.topicContentWrapper}>
      {/* Author Info Sidebar */}
      <div className={styles.authorSidebar}>
        <div className={styles.authorCard}>
          <img 
            src={author.avatar || '/default-avatar.png'} 
            alt={author.name}
            className={styles.authorAvatar}
          />
          <h3 className={styles.authorName}>{author.name}</h3>
          <span className={styles.authorRole}>{author.role}</span>
          
          <div className={styles.authorStats}>
            <div className={styles.statItem}>
              <User size={14} />
              <span>Member since {new Date(author.joinedDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.statItem}>
              <MessageSquare size={14} />
              <span>{author.postCount} posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <span className={styles.timestamp}>
            <Calendar size={14} />
            {formattedDate}
          </span>
          {metadata.lastEdited && (
            <span className={styles.editedMark}>
              (edited {new Date(metadata.lastEdited).toLocaleDateString()})
            </span>
          )}
        </div>

        <div className={`${styles.contentBody} ${isExpanded ? styles.expanded : ''}`}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          
          {!isExpanded && content.length > 500 && (
            <button 
              className={styles.expandButton}
              onClick={() => setIsExpanded(true)}
            >
              Read More
            </button>
          )}
        </div>

        <div className={styles.contentFooter}>
          <button 
            className={`${styles.likeButton} ${metadata.hasLiked ? styles.liked : ''}`}
            onClick={onLike}
            disabled={!isAuthenticated}
          >
            <ThumbsUp size={16} />
            <span>{metadata.likes}</span>
          </button>
          
          <div className={styles.contentActions}>
            {/* Add additional actions like Share, Report, etc. */}
          </div>
        </div>
      </div>
    </div>
  );
}