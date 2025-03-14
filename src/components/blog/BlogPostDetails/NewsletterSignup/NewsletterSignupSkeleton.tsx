import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './NewsletterSignup.module.scss';

const NewsletterSignupSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={clsx(styles.newsletterCard, theme === 'dark' && styles.dark)}
    >
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>
          <Mail size={16} className={styles.mailIcon} />
          Subscribe to Newsletter
        </h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.description}>
          <Skeleton 
            variant="text" 
            width="100%" 
            height={16}
            animation="pulse"
          />
          <Skeleton 
            variant="text" 
            width="85%" 
            height={16}
            animation="pulse"
          />
        </div>
        
        <div className={styles.form}>
          <div className={styles.inputWrapper}>
            <Skeleton 
              variant="rounded" 
              width="100%" 
              height={44}
              animation="pulse"
            />
          </div>
          
          <Skeleton 
            variant="rounded" 
            width="100%" 
            height={44}
            animation="pulse"
          />
        </div>
        
        <div className={styles.privacyNote}>
          <Skeleton 
            variant="text" 
            width="70%" 
            height={12}
            animation="pulse"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NewsletterSignupSkeleton;