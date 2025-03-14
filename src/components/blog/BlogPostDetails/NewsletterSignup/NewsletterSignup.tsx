import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import clsx from 'clsx';
import styles from './NewsletterSignup.module.scss';

const NewsletterSignup: React.FC = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual newsletter API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        toast.success('Thanks for subscribing to our newsletter!');
        setEmail('');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
        <p className={styles.description}>
          Get the latest posts and updates delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={styles.emailInput}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.subscribeButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        <p className={styles.privacyNote}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </motion.div>
  );
};

export default NewsletterSignup;