"use client";
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import styles from './LoadingState.module.scss';

export default function LoadingState() {
  return (
    <motion.div 
      className={styles.loadingContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={styles.loader}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader size={36} />
      </motion.div>
      <p className={styles.loadingText}>Loading messages...</p>
    </motion.div>
  );
}