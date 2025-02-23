// components/ui/Toast/CustomToast.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './CustomToast.module.scss';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  description?: string;
  duration?: number;
  onClose: () => void;
}

const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.9 }
};

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  description,
  onClose,
  duration = 3000
}) => {
  const Icon = icons[type];

  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      className={`${styles.toast} ${styles[type]}`}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={styles.iconContainer}>
        <Icon className={styles.icon} />
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button onClick={onClose} className={styles.closeButton}>
        <X size={18} />
      </button>
    </motion.div>
  );
};

export default Toast;