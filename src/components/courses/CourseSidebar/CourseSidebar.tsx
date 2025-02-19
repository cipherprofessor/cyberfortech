// src/components/courses/CourseSidebar/CourseSidebar.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ShoppingCart, Share2, Heart, PlayCircle } from 'lucide-react';
import styles from './CourseSidebar.module.scss';
import { Button } from '@/components/ui/button';
import { CourseSidebarProps } from '../types';


export function CourseSidebar({
  course,
  className,
  onEnroll,
  onWishlist,
  onShare,
  customTheme
}: CourseSidebarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Combine classes
  const sidebarClasses = [
    styles.sidebar,
    className,
    theme === 'dark' ? styles.dark : '',
  ].filter(Boolean).join(' ');

  const handleEnroll = async () => {
    if (!onEnroll) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onEnroll(course.id);
      router.push(`/dashboard/courses/${course.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (onWishlist) {
      try {
        await onWishlist(course.id);
      } catch (err) {
        console.error('Failed to add to wishlist:', err);
      }
    }
  };

  const handleShare = async () => {
    if (onShare) {
      try {
        await onShare(course.id);
      } catch (err) {
        console.error('Failed to share course:', err);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <motion.div 
      className={sidebarClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-theme={theme}
      style={
        customTheme ? {
          '--primary-color': customTheme.primary,
          '--primary-hover': customTheme.secondary,
        } as React.CSSProperties : {}
      }
    >
      <div className={styles.preview}>
        <img 
          src={course.image_url || "/api/placeholder/350/200"}
          alt={`Preview for ${course.id}`}
          className={styles.previewImage}
          loading="lazy"
        />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* <PlayCircle 
            className={styles.playIcon} 
            size={48} 
            aria-label="Play preview"
          /> */}
        </motion.div>
      </div>

      <div className={styles.pricing} aria-label="Course pricing">
        <span className={styles.price}>{formatPrice(course.price)}</span>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleEnroll}
          className={styles.enrollButton}
          disabled={loading}
          aria-busy={loading}
        >
          <ShoppingCart className={styles.icon} size={20} aria-hidden="true" />
          {loading ? 'Enrolling...' : 'Enroll Now'}
        </Button>

        <AnimatePresence>
          {error && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className={styles.secondaryActions}>
          <Button 
            variant="outline" 
            className={styles.actionButton}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart className={styles.icon} size={20} aria-hidden="true" />
            Wishlist
          </Button>
          <Button 
            variant="outline" 
            className={styles.actionButton}
            onClick={handleShare}
            aria-label="Share course"
          >
            <Share2 className={styles.icon} size={20} aria-hidden="true" />
            Share
          </Button>
        </div>
      </div>

      <div className={styles.info} role="list">
        <div className={styles.infoItem} role="listitem">
          <span className={styles.label}>Students</span>
          <span className={styles.value}>{course.total_students.toLocaleString()}</span>
        </div>
        <div className={styles.infoItem} role="listitem">
          <span className={styles.label}>Duration</span>
          <span className={styles.value}>{course.duration}</span>
        </div>
        <div className={styles.infoItem} role="listitem">
          <span className={styles.label}>Level</span>
          <span className={styles.value}>{course.level}</span>
        </div>
      </div>

      <div className={styles.guarantee}>
        <p>30-Day Money-Back Guarantee</p>
        <p>Full Lifetime Access</p>
      </div>
    </motion.div>
  );
}