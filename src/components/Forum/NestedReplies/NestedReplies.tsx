// src/components/Forum/NestedReplies/NestedReplies.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  ThumbsUp, 
  MoreVertical, 
  Reply as ReplyIcon,
  Flag 
} from 'lucide-react';
import { RichReplyForm } from '../ReplyForm/RichReplyForm';
import { Button } from '@heroui/react';
import styles from './NestedReplies.module.scss';

interface Reply {
  id: number;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  hasLiked?: boolean;
  depth: number;
  children?: Reply[];
}

interface NestedRepliesProps {
  replies: Reply[];
  onAddReply: (content: string, parentId: number) => Promise<void>;
  onLikeReply: (replyId: number) => Promise<void>;
  onReportReply: (replyId: number) => Promise<void>;
  maxDepth?: number;
}

export function NestedReplies({
  replies,
  onAddReply,
  onLikeReply,
  onReportReply,
  maxDepth = 3
}: NestedRepliesProps) {
  const { user, isAuthenticated } = useAuth();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const toggleReplies = (replyId: number) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  const renderReply = (reply: Reply, depth: number = 0) => {
    const hasChildren = reply.children && reply.children.length > 0;
    const canNest = depth < maxDepth;
    const isExpanded = expandedReplies.has(reply.id);

    return (
      <div 
        key={reply.id} 
        className={`${styles.replyWrapper} ${styles[`depth-${depth}`]}`}
      >
        <div className={styles.replyContent}>
          <div className={styles.replyHeader}>
            <div className={styles.authorInfo}>
              <img 
                src={reply.authorAvatar || '/default-avatar.png'} 
                alt={reply.authorName}
                className={styles.authorAvatar}
              />
              <span className={styles.authorName}>{reply.authorName}</span>
              <span className={styles.replyDate}>
                {new Date(reply.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className={styles.replyActions}>
              <button
                onClick={() => onLikeReply(reply.id)}
                className={`${styles.actionButton} ${reply.hasLiked ? styles.liked : ''}`}
                disabled={!isAuthenticated}
              >
                <ThumbsUp size={14} />
                <span>{reply.likes}</span>
              </button>

              {isAuthenticated && canNest && (
                <button
                  onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                  className={styles.actionButton}
                >
                  <ReplyIcon size={14} />
                  <span>Reply</span>
                </button>
              )}

              <Button isIconOnly variant="light" size="sm">
                <MoreVertical size={14} />
              </Button>
            </div>
          </div>

          <div 
            className={styles.replyText}
            dangerouslySetInnerHTML={{ __html: reply.content }}
          />

          {replyingTo === reply.id && (
            <div className={styles.replyForm}>
              <RichReplyForm
                onSubmit={async (content) => {
                  await onAddReply(content, reply.id);
                  setReplyingTo(null);
                }}
                isSubmitting={false}
                placeholder={`Reply to ${reply.authorName}...`}
              />
            </div>
          )}
        </div>

        {hasChildren && (
          <>
            <button
              className={styles.toggleReplies}
              onClick={() => toggleReplies(reply.id)}
            >
              {isExpanded ? 'Hide replies' : `Show ${reply.children!.length} replies`}
            </button>

            {isExpanded && (
              <div className={styles.nestedReplies}>
                {reply.children!.map(childReply => 
                  renderReply(childReply, depth + 1)
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.nestedRepliesContainer}>
      {replies.map(reply => renderReply(reply))}
    </div>
  );
}