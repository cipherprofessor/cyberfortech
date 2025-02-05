// src/app/(routes)/forum/topics/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { TopicContent } from '@/components/Forum/TopicContent/TopicContent';
import { TopicReplies } from '@/components/Forum/TopicReplies/TopicReplies';
import { RichReplyForm } from '@/components/Forum/ReplyForm/RichReplyForm';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.scss';
import { MessageSquare } from 'lucide-react';
import { TopicSkeleton } from '@/components/Forum/Skeleton/TopicSkeleton/TopicSkeleton';

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
  isLocked: boolean;
  replies: Reply[];
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
      setTopic(prev => prev ? {
        ...prev,
        likes: response.data.likes,
        hasLiked: response.data.hasLiked
      } : null);
    } catch (err) {
      console.error('Error liking topic:', err);
    }
  };

  const handleSubmitReply = async (content: string) => {
    if (!topic) return;
    
    setIsSubmittingReply(true);
    try {
      const response = await axios.post(`/api/forum/topics/${topic.id}/replies`, {
        content,
        authorId: user?.id
      });
      setReplies(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmittingReply(false);
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
      <TopicContent 
        content={topic.content}
        author={{
          id: topic.author.id,
          name: topic.author.name,
          avatar: topic.author.avatar,
          role: topic.author.role,
          joinedDate: topic.author.joinedDate,
          postCount: topic.author.postCount
        }}
        metadata={{
          createdAt: topic.createdAt,
          lastEdited: topic.updatedAt,
          likes: topic.likes,
          hasLiked: topic.hasLiked
        }}
        onLike={handleLike}
      />

      {/* Replies Section */}
      <div className={styles.repliesSection}>
        <h2>
          <MessageSquare size={20} />
          Replies ({replies.length})
        </h2>
        
        <TopicReplies 
          replies={replies}
          topicAuthorId={topic.authorId}
          onLikeReply={async (replyId) => {
            try {
              const response = await axios.post(`/api/forum/replies/${replyId}/like`);
              setReplies(prev => prev.map(reply => 
                reply.id === replyId 
                  ? { ...reply, ...response.data }
                  : reply
              ));
            } catch (err) {
              console.error('Error liking reply:', err);
            }
          }}
          onMarkAnswer={async (replyId) => {
            try {
              const response = await axios.post(`/api/forum/replies/${replyId}/mark-answer`);
              setReplies(prev => prev.map(reply => 
                reply.id === replyId 
                  ? { ...reply, isAnswer: true }
                  : { ...reply, isAnswer: false }
              ));
            } catch (err) {
              console.error('Error marking answer:', err);
            }
          }}
        />

        {!topic.isLocked && (
          <RichReplyForm 
            onSubmit={handleSubmitReply}
            isSubmitting={isSubmittingReply}
          />
        )}
      </div>
    </div>
  );
}