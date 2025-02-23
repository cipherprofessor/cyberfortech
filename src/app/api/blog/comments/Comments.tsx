// components/Comments/Comments.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { MessageCircle, Reply, Trash2, Send, LogIn } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import CustomAvatar from '@/components/ui/CustomAvatar/CustomAvatar';

import styles from './Comments.module.scss';
import { Comment, CommentsProps, CommentFormData } from '@/types/comments';
import DeleteModal from '@/app/dashboard/myworkspace/components/ui/DeleteConfirmation/DeleteModal/DeleteModal';
import { useToast } from '@/app/dashboard/myworkspace/components/ui/Toast/ToastContext';


const AnimatedComment: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.commentItem}
    >
      {children}
    </motion.div>
  );
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
  const { showToast } = useToast(); // Add this

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isSignedIn) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, parentId });
      setContent('');
      showToast({  // Replace toast.success with this
        message: 'Comment posted successfully',
        type: 'success',
        description: 'Your comment has been added to the discussion.'
      });
    } catch (error) {
      showToast({  // Replace toast.error with this
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
        <Button
          onClick={() => window.location.href = '/sign-in'}
          variant="outline"
          className={styles.signInButton}
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
        className={styles.commentInput}
      />
      <div className={styles.formActions}>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={styles.submitButton}
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();
  
  const canDelete = 
    user?.id === comment.userId || 
    user?.publicMetadata?.role === 'admin' || 
    user?.publicMetadata?.role === 'superadmin';

    const handleDelete = async () => {
      try {
        await onDelete(comment.id);
        showToast({  // Replace toast.success with this
          message: 'Comment deleted successfully',
          type: 'success',
          description: 'Your comment has been removed.'
        });
      } catch (error) {
        showToast({  // Replace toast.error with this
          message: 'Failed to delete comment',
          type: 'error',
          description: 'Please try again later.'
        });
      }
    };

  return (
    <AnimatedComment>
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
          <CustomAvatar
            src={comment.user.avatarUrl}
            alt={comment.user.fullName}
            size="md"
            className={styles.avatar}
          />
          <div className={styles.userMeta}>
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
              className={styles.actionButton}
            >
              <Reply className="mr-2 h-4 w-4" />
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
              <Trash2 className="h-4 w-4" />
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
    </AnimatedComment>
  );
};


// Add this at the end of your Comments.tsx file

export const Comments: React.FC<CommentsProps> = ({
  postId,
  className,
  onCommentAdded,
  onCommentDeleted
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      fetchComments();
    }
  }, [isLoaded]);

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

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          <MessageCircle className="mr-2 h-5 w-5" />
          Comments ({comments.length})
        </h3>
      </div>

      {!replyToId && (
        <CommentForm
          postId={postId}
          onSubmit={async (data) => {
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

              onCommentAdded?.(newComment);
            } catch (err) {
              console.error('Error submitting comment:', err);
              throw err;
            }
          }}
        />
      )}

      <AnimatePresence>
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={setReplyToId}
                onDelete={async (commentId) => {
                  try {
                    const response = await fetch(`/api/blog/comments?id=${commentId}`, {
                      method: 'DELETE'
                    });

                    if (!response.ok) throw new Error('Failed to delete comment');

                    setComments(prevComments => 
                      prevComments.filter(comment => {
                        if (comment.id === commentId) return false;
                        if (comment.replies) {
                          comment.replies = comment.replies.filter(reply => reply.id !== commentId);
                        }
                        return true;
                      })
                    );

                    onCommentDeleted?.(commentId);
                  } catch (err) {
                    console.error('Error deleting comment:', err);
                    throw err;
                  }
                }}
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
                    onSubmit={async (data) => {
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
                        setComments(prevComments => 
                          prevComments.map(comment => 
                            comment.id === data.parentId
                              ? { ...comment, replies: [...(comment.replies || []), newComment] }
                              : comment
                          )
                        );

                        setReplyToId(null);
                        onCommentAdded?.(newComment);
                      } catch (err) {
                        console.error('Error submitting comment:', err);
                        throw err;
                      }
                    }}
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