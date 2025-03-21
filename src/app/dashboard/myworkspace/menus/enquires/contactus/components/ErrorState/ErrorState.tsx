"use client";
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <motion.div 
      className={styles.errorContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconContainer}>
        <AlertTriangle size={36} />
      </div>
      <h3 className={styles.errorTitle}>Error Loading Data</h3>
      <p className={styles.errorMessage}>{message}</p>
      <button 
        className={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </motion.div>
  );
}