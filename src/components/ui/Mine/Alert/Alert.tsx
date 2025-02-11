// src/components/ui/Alerts/Alert.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './Alert.module.scss';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
  duration?: number; // Duration in milliseconds
  showIcon?: boolean;
}

export function Alert({ 
  message, 
  type, 
  onClose, 
  duration = 3000, 
  showIcon = true 
}: AlertProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const variants = {
    initial: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.alert} ${styles[type]} ${isDark ? styles.dark : ''}`}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className={styles.content}>
          {showIcon && (
            <motion.div
              initial={{ rotate: -45 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={styles.icon}
            >
              {type === 'success' ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </motion.div>
          )}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {message}
          </motion.p>
        </div>

        {onClose && (
          <motion.button
            className={styles.closeButton}
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Helper components for specific types
export function SuccessAlert(props: Omit<AlertProps, 'type'>) {
  return <Alert {...props} type="success" />;
}

export function ErrorAlert(props: Omit<AlertProps, 'type'>) {
  return <Alert {...props} type="error" />;
}