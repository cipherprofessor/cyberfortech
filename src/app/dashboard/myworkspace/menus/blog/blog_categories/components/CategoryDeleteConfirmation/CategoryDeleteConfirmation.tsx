// src/app/dashboard/myworkspace/menus/blog/blog_categories/components/CategoryDeleteConfirmation.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import styles from './CategoryDeleteConfirmation.module.scss';

interface CategoryDeleteConfirmDialogProps {
  show: boolean;
  categoryNames: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function CategoryDeleteConfirmDialog({
  show,
  categoryNames,
  onConfirm,
  onCancel
}: CategoryDeleteConfirmDialogProps) {
  if (!show) return null;

  const isSingleDelete = categoryNames.length === 1;
  const categoryDisplay = isSingleDelete
    ? categoryNames[0]
    : `${categoryNames.length} categories`;

  return (
    <AnimatePresence>
      {show && (
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
              <h3>Delete {isSingleDelete ? 'Category' : 'Categories'}</h3>
              <p>
                Are you sure you want to delete <strong>{categoryDisplay}</strong>?
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
                  Delete {isSingleDelete ? 'Category' : 'Categories'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}