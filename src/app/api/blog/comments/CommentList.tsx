// components/Comments/CommentList.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Comment } from '@/types/comments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import styles from './Comments.module.scss';
import { CommentFormData } from '@/types/comments';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  replyToId: string | null;
  onReply: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancelReply: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  postId,
  replyToId,
  onReply,
  onDelete,
  onSubmit,
  onCancelReply,
}) => {
  return (
    <AnimatePresence>
      <div className={styles.commentList}>
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <CommentItem
              comment={comment}
              onReply={onReply}
              onDelete={onDelete}
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
                  onSubmit={onSubmit}
                  onCancel={onCancelReply}
                />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default React.memo(CommentList);