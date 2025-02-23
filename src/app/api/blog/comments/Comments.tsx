// components/Comments/Comments.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { MessageCircle, Reply, Trash2, Send, LogIn } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import CustomAvatar from '@/components/ui/CustomAvatar/CustomAvatar';

import styles from './Comments.module.scss';
import { 
  Comment, 
  CommentsProps, 
  CommentFormProps, 
  CommentItemProps, 
  CommentFormData 
} from '@/types/comments';
import { useToast } from '@/app/dashboard/myworkspace/components/ui/Toast/ToastContext';
import DeleteModal from '@/app/dashboard/myworkspace/components/ui/DeleteConfirmation/DeleteModal/DeleteModal';

const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  parentId, 
  onSubmit, 
  onCancel 
}) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isSignedIn) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, parentId });
      setContent('');
      showToast({
        message: 'Comment posted successfully',
        type: 'success',
        description: parentId ? 'Your reply has been added.' : 'Your comment has been added.'
      });
    } catch (error) {
      showToast({
        message: 'Failed to post comment',
        type: 'error',
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className={styles.signInPrompt}>
        <p>Please sign in to leave a comment</p>
        <Button onClick={() => window.location.href = '/sign-in'} variant="outline">
          <LogIn className="mr-2 h-4 w-4" />Sign In
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
        />
        <span className={styles.userName}>{user?.fullName}</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        required
        disabled={isSubmitting}
        className={styles.commentInput}
      />
      <div className={styles.formActions}>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          <Send size={16} className="mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onDelete }) => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const canDelete = user?.id === comment.userId || 
    user?.publicMetadata?.role === 'admin' || 
    user?.publicMetadata?.role === 'superadmin';

  const handleDelete = async () => {
    try {
      await onDelete(comment.id);
      showToast({
        message: 'Comment deleted successfully',
        type: 'success',
        description: 'Your comment has been removed.'
      });
    } catch (error) {
      showToast({
        message: 'Failed to delete comment',
        type: 'error',
        description: 'Please try again later.'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.commentItem}
    >
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
          <CustomAvatar
            src={comment.user.avatarUrl}
            alt={comment.user.fullName}
            size="md"
          />
          <div className={styles.userMeta}>
            <span className={styles.userName}>{comment.user.fullName}</span>
            <time className={styles.metadata}>
              {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
              {comment.updatedAt !== comment.createdAt && ' (edited)'}
            </time>
          </div>
        </div>
        <div className={styles.actions}>
          {user && (
            <Button
              onClick={() => onReply(comment.id)}
              variant="ghost"
              size="sm"
              className={`${styles.actionButton} ${styles.replyButton}`}
            >
              <Reply size={16} />
              Reply
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="ghost"
              size="sm"
              className={`${styles.actionButton} ${styles.deleteButton}`}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className={styles.content}>{comment.content}</div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
      />

      {(comment.replies ?? []).length > 0 && (
        <div className={styles.replies}>
          {(comment.replies ?? []).map((reply) => (
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

export const Comments: React.FC<CommentsProps> = ({ postId, className }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/comments?postId=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      showToast({
        message: 'Failed to load comments',
        type: 'error',
        description: 'Please try refreshing the page.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [postId, showToast]);

  useEffect(() => {
    if (isLoaded) fetchComments();
  }, [isLoaded, fetchComments]);

  const handleSubmitComment = async (data: CommentFormData) => {
    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, ...data })
      });

      if (!response.ok) throw new Error('Failed to submit comment');
      
      const newComment: Comment = await response.json();
      setComments(prev => 
        data.parentId 
          ? prev.map(comment => 
              comment.id === data.parentId
                ? { ...comment, replies: [...(comment.replies || []), newComment] }
                : comment
            )
          : [newComment, ...prev]
      );
      if (data.parentId) setReplyToId(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/blog/comments?id=${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(prev => 
        prev.filter(comment => {
          if (comment.id === commentId) return false;
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply.id !== commentId);
          }
          return true;
        })
      );
    } catch (err) {
      throw err;
    }
  };

  if (!isLoaded || isLoading) {
    return <div className={styles.loading}>Loading comments...</div>;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <h3>
          <MessageCircle size={20} />
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
        {comments.map(comment => (
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
      </AnimatePresence>
    </div>
  );
};

export default Comments;