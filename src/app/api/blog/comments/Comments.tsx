"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Image from 'next/image';
import clsx from 'clsx';
import { MessageCircle, Reply, Trash2, Send, LogIn } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

import styles from './Comments.module.scss';
import { Comment, CommentsProps, CommentFormData } from '@/types/comments';

import CustomAvatar from '@/components/ui/CustomAvatar/CustomAvatar';


const commentAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const CommentForm: React.FC<{
  postId: string;
  parentId?: string;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
}> = ({ postId, parentId, onSubmit, onCancel }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isSignedIn) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, parentId });
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className={styles.signInPrompt}>
        <p>Please sign in to leave a comment</p>
        <Button
          onClick={() => window.location.href = '/sign-in'}
          variant="outline"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <div className={styles.formHeader}>
  <CustomAvatar
    src={user?.imageUrl}
    alt={user?.fullName || 'User'}
    fallback={user?.firstName?.[0] || 'U'}
    size="md"
    className={styles.userAvatar}
  />
  <span className={styles.userName}>{user?.fullName}</span>
</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        required
        disabled={isSubmitting}
        aria-label="Comment content"
      />
      <div className={styles.formActions}>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
}> = ({ comment, onReply, onDelete }) => {
  const { user } = useUser();
  const canDelete = 
    user?.id === comment.userId || 
    user?.publicMetadata?.role === 'admin' || 
    user?.publicMetadata?.role === 'superadmin';

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await onDelete(comment.id);
    }
  };

  return (
    <motion.div
      className={styles.commentItem}
      {...commentAnimation}
      layout
    >
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
        <CustomAvatar
    src={comment.user.avatarUrl}
    alt={comment.user.fullName}
    size="md"
    className={styles.avatar}
  />
          <div>
            <span className={styles.userName}>{comment.user.fullName}</span>
            <div className={styles.metadata}>
              <time dateTime={comment.createdAt}>
                {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
              </time>
              {comment.updatedAt !== comment.createdAt && (
                <span>(edited)</span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          {user && (
            <Button
              onClick={() => onReply(comment.id)}
              variant="ghost"
              size="sm"
              className={styles.replyButton}
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className={styles.deleteButton}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className={styles.content}>{comment.content}</div>
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const Comments: React.FC<CommentsProps> = ({
  postId,
  className,
  onCommentAdded,
  onCommentDeleted
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      fetchComments();
    }
  }, [postId, isLoaded]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blog/comments?postId=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (data: CommentFormData) => {
    if (!isSignedIn || !user) return;

    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: data.content,
          parentId: data.parentId
        })
      });

      if (!response.ok) throw new Error('Failed to submit comment');
      
      const newComment = await response.json();
      if (data.parentId) {
        setComments(comments.map(comment => 
          comment.id === data.parentId
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        ));
      } else {
        setComments([newComment, ...comments]);
      }

      setReplyToId(null);
      onCommentAdded?.(newComment);
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isSignedIn) return;

    try {
      const response = await fetch(`/api/blog/comments?id=${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter(comment => {
        if (comment.id === commentId) return false;
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply.id !== commentId);
        }
        return true;
      }));

      onCommentDeleted?.(commentId);
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className={clsx(styles.container, className)}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        <h3>
          <MessageCircle className="mr-2 h-5 w-5" />
          Comments ({comments.length})
        </h3>
      </div>

      {!replyToId && (
        <CommentForm
          postId={postId}
          onSubmit={handleSubmitComment}
        />
      )}

      <AnimatePresence>
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={setReplyToId}
                onDelete={handleDeleteComment}
              />
              {replyToId === comment.id && (
                <motion.div
                  className={styles.replies}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CommentForm
                    postId={postId}
                    parentId={comment.id}
                    onSubmit={handleSubmitComment}
                    onCancel={() => setReplyToId(null)}
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Comments;