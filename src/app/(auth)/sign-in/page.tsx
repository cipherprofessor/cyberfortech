'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import AuthCard from '@/components/auth/AuthCard';

export default function SignInPage() {
  const router = useRouter();
  
  return (
    <div className={styles.authContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthCard 
          mode="signin"
          backgroundImage="/images/auth-bg.jpg"
          brandTagline="Welcome Back to CyberFort Tech"
          onSuccess={() => router.push('/dashboard')}
          onError={(error) => console.error('Sign in error:', error)}
        />
      </motion.div>
    </div>
  );
}