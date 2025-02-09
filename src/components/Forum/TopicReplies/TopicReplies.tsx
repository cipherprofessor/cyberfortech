// src/components/Forum/TopicReplies/TopicReplies.tsx
'use client';

import { useState } from 'react';
import { ThumbsUp, MoreVertical, Check, Flag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button/Button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import styles from './TopicReplies.module.scss';

interface Reply {
  id: number;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  createdAt: string;
  lastEdited?: string;
  likes: number;
  hasLiked?: boolean;
  isAnswer?: boolean;
}

interface TopicRepliesProps {
  replies: Reply[];
  topicAuthorId: string;
  onLikeReply: (replyId: number) => Promise<void>;
  onMarkAnswer: (replyId: number) => Promise<void>;
}

export function TopicReplies({ 
  replies, 
  topicAuthorId, 
  onLikeReply, 
  onMarkAnswer 
}: TopicRepliesProps) {
  const { user, isAuthenticated } = useAuth();
  const [showReplies, setShowReplies] = useState(true);

  const handleLikeReply = async (replyId: number) => {
    if (!isAuthenticated) return;
    await onLikeReply(replyId);
  };

  return (
    <div className={styles.repliesContainer}>
      <div className={styles.repliesHeader}>
        <h3>{replies.length} Replies</h3>
        <Button 
          variant="ghost"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? 'Hide Replies' : 'Show Replies'}
        </Button>
      </div>

      {showReplies && (
        <div className={styles.repliesList}>
          {replies.map((reply) => (
            <div 
              key={reply.id} 
              className={`${styles.replyItem} ${reply.isAnswer ? styles.isAnswer : ''}`}
            >
              <div className={styles.replyAuthor}>
                <img 
                  src={reply.authorAvatar || '/default-avatar.png'} 
                  alt={reply.authorName}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{reply.authorName}</span>
                  {reply.authorRole && (
                    <span className={styles.authorRole}>{reply.authorRole}</span>
                  )}
                </div>
              </div>

              <div className={styles.replyContent}>
                <div className={styles.replyText}>
                  <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                </div>

                <div className={styles.replyMeta}>
                  <span className={styles.replyDate}>
                    {new Date(reply.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {reply.lastEdited && (
                    <span className={styles.editedMark}>
                      (edited)
                    </span>
                  )}
                </div>

                <div className={styles.replyActions}>
                  <button 
                    className={`${styles.likeButton} ${reply.hasLiked ? styles.liked : ''}`}
                    onClick={() => handleLikeReply(reply.id)}
                    disabled={!isAuthenticated}
                  >
                    <ThumbsUp size={16} />
                    <span>{reply.likes}</span>
                  </button>

                  {user?.id === topicAuthorId && !reply.isAnswer && (
                    <button
                      className={styles.markAnswerButton}
                      onClick={() => onMarkAnswer(reply.id)}
                    >
                      <Check size={16} />
                      <span>Mark as Answer</span>
                    </button>
                  )}

                  <Dropdown>
                    <DropdownTrigger>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={styles.moreButton}
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {user?.id === reply.authorId ? (
                        <DropdownItem key="edit">Edit Reply</DropdownItem>
                      ) : null}
                      <DropdownItem key="report" className={styles.reportItem}>
                        <Flag size={14} />
                        Report Reply
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}