// src/app/(auth)/sign-in/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import styles from '../page.module.scss';
import AuthCard from '@/app/dashboard/myworkspace/components/ui/AuthCard/AuthCard';

export default function SignInPage() {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.authContainer}
    >
      <AuthCard 
        mode="signin"
        backgroundImage="/images/cybersecurity-bg.jpg"
        onSuccess={() => router.push('/dashboard')}
        onError={(error) => console.error('Sign in error:', error)}
      />
    </motion.div>
  );
}