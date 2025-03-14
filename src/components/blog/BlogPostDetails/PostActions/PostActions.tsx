import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import clsx from 'clsx';
import styles from './PostActions.module.scss';

interface PostActionsProps {
  isAuthor?: boolean;
  currentUserRole?: string;
  onEdit: () => void;
  onDelete: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  isAuthor,
  currentUserRole,
  onEdit,
  onDelete,
  onBookmark,
  isBookmarked,
  likeCount,
  onLike,
  onShare
}) => {
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'superadmin';
  const showAdminActions = isAuthor || isAdmin;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={styles.actions}
    >
      {showAdminActions && (
        <div className={styles.adminActions}>
          <button onClick={onEdit} className={clsx(styles.actionButton, styles.editButton)}>
            <Edit size={18} />
            <span className={styles.actionLabel}>Edit</span>
          </button>
          <button onClick={onDelete} className={clsx(styles.actionButton, styles.deleteButton)}>
            <Trash2 size={18} />
            <span className={styles.actionLabel}>Delete</span>
          </button>
        </div>
      )}
      
      <div className={styles.userActions}>
        <button 
          onClick={onLike}
          className={clsx(styles.actionButton, likeCount > 0 && styles.liked)}
          aria-label="Like post"
        >
          <ThumbsUp size={18} />
          {likeCount > 0 && <span className={styles.actionCount}>{likeCount}</span>}
        </button>
        
        <button 
          onClick={onBookmark}
          className={clsx(styles.actionButton, isBookmarked && styles.bookmarked)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
        >
          <Bookmark size={18} />
        </button>
        
        <button 
          onClick={onShare} 
          className={styles.actionButton}
          aria-label="Share post"
        >
          <Share2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default PostActions;