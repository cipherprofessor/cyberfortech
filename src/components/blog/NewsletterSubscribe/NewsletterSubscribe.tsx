import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { showToast } from '@/components/ui/mohsin-toast';
import styles from './NewsletterSubscribe.module.scss';

interface NewsletterSubscribeProps {
  className?: string;
}

const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast('Error', 'Please enter your email address', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showToast('Error', 'Please enter a valid email address', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Success', 'You have successfully subscribed to the newsletter!', 'success');
      setEmail('');
    } catch (error) {
      showToast('Error', 'Failed to subscribe. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.iconWrapper}>
        <Mail size={24} className={styles.icon} />
      </div>
      
      <h3 className={styles.title}>Subscribe to our Newsletter</h3>
      
      <p className={styles.description}>
        Get the latest articles, tutorials, and updates delivered straight to your inbox.
      </p>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={styles.input}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className={styles.spinner}></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        
        <p className={styles.disclaimer}>
          We respect your privacy. No spam, ever.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscribe;