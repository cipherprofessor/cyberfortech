import React from 'react';
import { motion } from 'framer-motion';
import styles from './WelcomeBanner.module.scss';

export interface WelcomeBannerProps {
  userName: string;
  progress?: number;
  message?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  progress = 0,
  message = "Keep going and boost your skills with courses.",
  ctaText = "View Courses",
  onCtaClick,
  className = ""
}) => {
  return (
    <motion.div 
      className={`${styles.container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.content}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome Back, {userName} <span className={styles.wave}>👋</span>
        </motion.h1>
        
        <motion.div 
          className={styles.messageWrapper}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {progress > 0 && (
            <p className={styles.progress}>
              You've reached {progress}% of your goal this month!
            </p>
          )}
          <p className={styles.message}>{message}</p>
        </motion.div>

        <motion.button
          className={styles.cta}
          onClick={onCtaClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {ctaText}
        </motion.button>
      </div>

      <motion.div 
        className={styles.illustration}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.3,
          type: "spring",
          stiffness: 100
        }}
      >
        <div className={styles.book3} />
        <div className={styles.book2} />
        <div className={styles.book1} />
        <div className={styles.pencils}>
          <div className={styles.pencil1} />
          <div className={styles.pencil2} />
        </div>
      </motion.div>

      <div className={styles.patternOverlay} />
    </motion.div>
  );
};

export default WelcomeBanner;