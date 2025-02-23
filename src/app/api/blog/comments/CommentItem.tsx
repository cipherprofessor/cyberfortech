// components/Comments/CommentItem.tsx
import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Reply, Trash2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/app/dashboard/myworkspace/components/ui/DeleteConfirmation/DeleteModal/DeleteModal';
import CustomAvatar from '@/components/ui/CustomAvatar/CustomAvatar';
import { Comment } from '@/types/comments';
import styles from './Comments.module.scss';

const commentAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onDelete }) => {
  const { user } = useUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const canDelete = 
    user?.id === comment.userId || 
    user?.publicMetadata?.role === 'admin' || 
    user?.publicMetadata?.role === 'superadmin';

  const handleDelete = useCallback(async () => {
    try {
      await onDelete(comment.id);
      toast.success('Comment deleted successfully', {
        description: 'Your comment has been permanently removed.',
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete comment', {
        description: 'Please try again later.',
      });
      console.error('Error deleting comment:', error);
    }
  }, [comment.id, onDelete]);

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
            fallback={comment.user.fullName?.[0] || 'U'}
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
              onClick={() => setIsDeleteModalOpen(true)}
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
    </motion.div>
  );
};

export default React.memo(CommentItem);