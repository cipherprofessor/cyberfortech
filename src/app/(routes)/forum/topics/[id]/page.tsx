// src/app/(routes)/forum/topics/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { TopicContent } from '@/components/Forum/TopicContent/TopicContent';
import { NestedReplies } from '@/components/Forum/NestedReplies/NestedReplies';
import { ReactionButtonAnimated } from '@/components/Forum/ReactionButton/ReactionButtonAnimated';
import { AttachmentViewer } from '@/components/Forum/AttachmentViewer/AttachmentViewer';
import { ReactionAnalytics } from '@/components/Forum/ReactionAnalytics/ReactionAnalytics';
import { RichReplyForm } from '@/components/Forum/ReplyForm/RichReplyForm';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { TopicSkeleton } from '@/components/Forum/Skeleton/TopicSkeleton/TopicSkeleton';
import styles from './page.module.scss';

interface Reply {
  id: number;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  hasLiked: boolean;
  isAnswer: boolean;
  depth: number;
  children?: Reply[];
}

interface Attachment {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

interface Topic {
  id: number;
  title: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    joinedDate: string;
    postCount: number;
  };
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  hasLiked: boolean;
  attachments: Attachment[];
  reactions: Array<{
    type: 'like' | 'heart' | 'insightful' | 'funny';
    count: number;
    hasReacted: boolean;
  }>;
  isLocked: boolean;
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [params.id]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/forum/topics/${params.id}`);
      setTopic(response.data);
      setReplies(response.data.replies || []);
    } catch (err) {
      console.error('Error fetching topic:', err);
      setError('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!topic) return;
    try {
      const response = await axios.post(`/api/forum/topics/${topic.id}/like`);
      setTopic(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: response.data.likes,
          hasLiked: response.data.hasLiked
        };
      });
    } catch (err) {
      console.error('Error liking topic:', err);
    }
  };


  const handleReaction = async (type: 'like' | 'heart' | 'insightful' | 'funny') => {
    if (!topic) return;
    try {
      const response = await axios.post(`/api/forum/topics/${topic.id}/react`, { type });
      setTopic(prev => prev ? {
        ...prev,
        reactions: response.data.reactions
      } : null);
    } catch (err) {
      console.error('Error reacting to topic:', err);
    }
  };

  const handleAddReply = async (content: string, parentId?: number) => {
    if (!topic) return;
    
    setIsSubmittingReply(true);
    try {
      const response = await axios.post(`/api/forum/topics/${topic.id}/replies`, {
        content,
        parentId,
        authorId: user?.id
      });
      
      if (parentId) {
        // Update nested replies
        const updateReplies = (replies: Reply[]): Reply[] => {
          return replies.map(reply => {
            if (reply.id === parentId) {
              return {
                ...reply,
                children: [...(reply.children || []), response.data]
              };
            }
            if (reply.children) {
              return {
                ...reply,
                children: updateReplies(reply.children)
              };
            }
            return reply;
          });
        };
        
        setReplies(prev => updateReplies(prev));
      } else {
        setReplies(prev => [...prev, response.data]);
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLikeReply = async (replyId: number) => {
    try {
      const response = await axios.post(`/api/forum/replies/${replyId}/like`);
      const updateReplyLikes = (replies: Reply[]): Reply[] => {
        return replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: response.data.likes,
              hasLiked: response.data.hasLiked
            };
          }
          if (reply.children) {
            return {
              ...reply,
              children: updateReplyLikes(reply.children)
            };
          }
          return reply;
        });
      };
      setReplies(updateReplyLikes);
    } catch (err) {
      console.error('Error liking reply:', err);
    }
  };

  const handleReportReply = async (replyId: number) => {
    try {
      await axios.post(`/api/forum/replies/${replyId}/report`);
      // Show success notification
    } catch (err) {
      console.error('Error reporting reply:', err);
    }
  };

  if (loading) {
    return <TopicSkeleton />;
  }

  if (error || !topic) {
    return (
      <div className={styles.error}>
        {error || 'Topic not found'}
      </div>
    );
  }

  return (
    <div className={styles.topicPage}>
      <div className={styles.topicHeader}>
        <h1>{topic.title}</h1>
        <div className={styles.topicMeta}>
          <span>Posted in {topic.categoryName}</span>
          <span>•</span>
          <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className={styles.topicContent}>
      <TopicContent 
        content={topic.content}
        author={topic.author}
        metadata={{
          createdAt: topic.createdAt,
          lastEdited: topic.updatedAt,
          likes: topic.likes,
          hasLiked: topic.hasLiked
        }}
        onLike={handleLike}
      />

        {/* Attachments Section */}
        {topic.attachments && topic.attachments.length > 0 && (
          <div className={styles.attachmentsSection}>
            <AttachmentViewer 
              attachments={topic.attachments}
              isEditing={topic.authorId === user?.id}
              onRemove={async (attachmentId) => {
                try {
                  await axios.delete(`/api/forum/attachments/${attachmentId}`);
                  setTopic(prev => prev ? {
                    ...prev,
                    attachments: prev.attachments.filter(a => a.id !== attachmentId)
                  } : null);
                } catch (err) {
                  console.error('Error removing attachment:', err);
                }
              }}
            />
          </div>
        )}

        {/* Reactions Section */}
        <div className={styles.reactionsSection}>
          <ReactionButtonAnimated
            postId={topic.id}
            initialReactions={topic.reactions}
            onReact={handleReaction}
          />
          
          <button
            className={styles.analyticsToggle}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className={styles.analyticsSection}>
            <ReactionAnalytics 
              postId={topic.id}
              period="daily"
            />
          </div>
        )}
      </div>

      {/* Replies Section */}
      <div className={styles.repliesSection}>
        <h2>
          <MessageSquare size={20} />
          Replies ({replies.length})
        </h2>
        
        <NestedReplies 
          replies={replies}
          onAddReply={handleAddReply}
          onLikeReply={handleLikeReply}
          onReportReply={handleReportReply}
          maxDepth={3}
        />

        {!topic.isLocked && (
          <div className={styles.replyFormSection}>
            <RichReplyForm 
              onSubmit={(content) => handleAddReply(content)}
              isSubmitting={isSubmittingReply}
              placeholder="Add your reply..."
            />
          </div>
        )}
      </div>
    </div>
  );
}