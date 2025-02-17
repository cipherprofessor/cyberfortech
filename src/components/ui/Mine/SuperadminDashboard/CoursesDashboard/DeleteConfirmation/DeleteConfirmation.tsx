// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/DeleteConfirmation.tsx
//Alpha Centauri
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import styles from './DeleteConfirmation.module.scss';

interface DeleteConfirmDialogProps {
    show: boolean;
    courseName: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  export function DeleteConfirmDialog({
    show,
    courseName,
    onConfirm,
    onCancel
  }: DeleteConfirmDialogProps) {
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
            <h3>Delete Course</h3>
            <p>
              Are you sure you want to delete <strong>{courseName}</strong>?
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
                Delete Course
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }