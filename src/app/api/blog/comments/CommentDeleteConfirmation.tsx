// CommentDeleteConfirmation.tsx
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import styles from './CommentDeleteConfirmation.module.scss';

interface CommentDeleteConfirmationProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CommentDeleteConfirmation({
  show,
  onConfirm,
  onCancel
}: CommentDeleteConfirmationProps) {
  if (!show) return null;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.dialog}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className={styles.dialogContent}>
          <AlertTriangle 
            size={32} 
            className={styles.warningIcon}
          />
          <h3>Delete Comment</h3>
          <p>
            Are you sure you want to delete this comment?
            <br />
            This action cannot be undone.
          </p>
          <div className={styles.dialogActions}>
            <button
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

