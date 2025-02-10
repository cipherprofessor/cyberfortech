// src/components/courses/CourseSidebar/CourseSidebar.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

import { ShoppingCart, Share2, Heart, PlayCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './CourseSidebar.module.scss';
import { Button } from '@heroui/button';

interface CourseSidebarProps {
  course: {
    id: string;
    price: number;
    total_students: number;
    duration: string;
    level: string;
  };
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/courses/enroll', {
        courseId: course.id
      });
      router.push(`/dashboard/courses/${course.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to enroll in course');
    } finally {
      setLoading(false);
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
      className={`${styles.sidebar} ${isDark ? styles.dark : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.preview}>
        <img 
          src="/api/placeholder/350/200" 
          alt="Course Preview" 
          className={styles.previewImage}
        />
        <PlayCircle className={styles.playIcon} size={48} />
      </div>

      <div className={styles.pricing}>
        <span className={styles.price}>{formatPrice(course.price)}</span>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleEnroll}
          className={styles.enrollButton}
          disabled={loading}
        >
          <ShoppingCart className={styles.icon} size={20} />
          {loading ? 'Enrolling...' : 'Enroll Now'}
        </Button>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.secondaryActions}>
          <Button variant="flat" className={styles.actionButton}>
            <Heart className={styles.icon} size={20} />
            Wishlist
          </Button>
          <Button variant="flat" className={styles.actionButton}>
            <Share2 className={styles.icon} size={20} />
            Share
          </Button>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Students</span>
          <span className={styles.value}>{course.total_students}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Duration</span>
          <span className={styles.value}>{course.duration}</span>
        </div>
        <div className={styles.infoItem}>
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