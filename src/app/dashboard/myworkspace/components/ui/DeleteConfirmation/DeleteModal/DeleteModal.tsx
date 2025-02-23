// components/ui/DeleteModal/DeleteModal.tsx
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertCircle } from 'lucide-react';
import styles from './DeleteModal.module.scss';

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  className
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = useCallback(async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }, [isDeleting, onConfirm, onClose]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.wrapper}>
          <motion.div
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className={`${styles.modal} ${className || ''}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.borderLine} />
            
            <div className={styles.iconWrapper}>
              <motion.div
                className={styles.iconCircle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
              >
                <AlertCircle className={styles.icon} />
              </motion.div>
            </div>

            <div className={styles.content}>
              <h2 id="delete-modal-title" className={styles.title}>
                {title}
              </h2>
              <p id="delete-modal-description" className={styles.description}>
                {description}
              </p>
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                {cancelText}
              </button>
              <motion.button
                type="button"
                onClick={handleConfirm}
                className={styles.deleteButton}
                disabled={isDeleting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className={styles.buttonIcon} />
                {isDeleting ? 'Deleting...' : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;