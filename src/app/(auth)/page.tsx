// src/app/(auth)/auth/page.tsx
'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

import styles from './AuthPage.module.scss';
import AuthCard from '../dashboard/myworkspace/components/ui/AuthCard/AuthCard';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'signin';
  
  return (
    <main className={styles.authPage}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.container}
      >
        <AuthCard 
          mode={initialMode}
          backgroundImage="/images/auth-bg.jpg"
          brandTagline="Expand Your Knowledge, Secure Your Future"
          onSuccess={() => console.log('Authentication successful')}
          onError={(error) => console.error('Authentication error:', error)}
        />
      </motion.div>
    </main>
  );
}