"use client";
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import styles from './DashboardHeader.module.scss';

interface DashboardHeaderProps {
  totalMessages: number;
  newMessages: number;
}

export default function DashboardHeader({ totalMessages, newMessages }: DashboardHeaderProps) {
  return (
    <motion.div 
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.titleSection}>
        <div className={styles.iconContainer}>
          <MessageSquare size={24} />
        </div>
        <div className={styles.titleContent}>
          <h1 className={styles.title}>Messages Dashboard</h1>
          <p className={styles.subtitle}>
            Manage and respond to all incoming contact form messages
          </p>
        </div>
      </div>
      
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalMessages}</span>
          <span className={styles.statLabel}>Total Messages</span>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${newMessages > 0 ? styles.highlight : ''}`}>
            {newMessages}
          </span>
          <span className={styles.statLabel}>New Messages</span>
        </div>
      </div>
    </motion.div>
  );
}