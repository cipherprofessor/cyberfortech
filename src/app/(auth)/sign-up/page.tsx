'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import AuthCard from '@/components/auth/AuthCard';

export default function SignUpPage() {
  const router = useRouter();
  
  return (
    <div className={styles.authContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthCard 
          mode="signup"
          backgroundImage="/images/learning-bg.jpg"
          brandTagline="Join Our Learning Community"
          defaultRole="student"
          onSuccess={() => router.push('/dashboard')}
          onError={(error) => console.error('Sign up error:', error)}
        />
      </motion.div>
    </div>
  );
}