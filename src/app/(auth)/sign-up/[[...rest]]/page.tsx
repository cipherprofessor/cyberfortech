'use client';

import React from 'react';
import { SignUp } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './page.module.scss';

export default function SignUpPage() {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  return (
    <div className={styles.signupContainer}>
      {/* Left side - SignUp form */}
      <div className={styles.formSide}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className={styles.alreadyMember}>
            <span>Already member?</span>
            <Link href="/sign-in" className={styles.signInLink}>
              Sign in
            </Link>
          </div>
        </div>
        
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>Secure Your Communications with CyberFort</p>
          
          <div className={styles.clerkSignUpWrapper}>
            <SignUp 
              appearance={{
                elements: {
                  rootBox: {
                    width: '100%',
                    boxShadow: 'none',
                  },
                  card: {
                    border: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                  },
                  headerTitle: {
                    display: 'none',
                  },
                  headerSubtitle: {
                    display: 'none',
                  },
                  socialButtonsBlockButton: {
                    borderRadius: '0.75rem',
                    border: isDarkTheme ? '1px solid #374151' : '1px solid #e5e7eb',
                  },
                  formFieldInput: {
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: isDarkTheme ? '#1f2937' : '#f9fafb',
                    border: isDarkTheme ? '1px solid #374151' : '1px solid rgba(226, 232, 240, 0.8)',
                  },
                  formButtonPrimary: {
                    borderRadius: '0.75rem',
                    backgroundColor: '#6366f1',
                    '&:hover': {
                      backgroundColor: '#4f46e5',
                    },
                  },
                  footerAction: {
                    display: 'none', // Hide the "Sign in" link at the bottom
                  },
                }
              }}
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <motion.div 
        className={styles.illustrationSide}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.content}>
          <div className={styles.metrics}>
            <div className={styles.inbox}>
              <span className={styles.label}>Inbox</span>
              <span className={styles.value}>176,18</span>
              <div className={styles.chart}>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={styles.chartLine}
                >
                  <svg width="150" height="60" viewBox="0 0 150 60">
                    <path d="M0,30 C20,10 40,50 60,30 S100,10 120,30 S140,50 150,30" stroke="#F59E0B" fill="none" strokeWidth="3" />
                    <path d="M0,30 C30,60 60,0 90,30 S120,60 150,30" stroke="#6366F1" fill="none" strokeWidth="3" />
                  </svg>
                </motion.div>
                <div className={styles.chartBadge}>45</div>
              </div>
            </div>
          </div>
          
          <div className={styles.socialIcons}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className={styles.iconCircle}
            >
              <Image src="/socialmediaicons/instagram.png" alt="Instagram" width={24} height={24} />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className={styles.iconCircle}
            >
              <Image src="/socialmediaicons/gold-key.png" alt="TikTok" width={24} height={24} />
            </motion.div>
          </div>
          
          <div className={styles.dataCard}>
            <div className={styles.dataCardIcon}>
              <Image src="/socialmediaicons/stalking.png" alt="Security Key" width={24} height={24} />
            </div>
            <h3 className={styles.dataCardTitle}>Your data, your rules</h3>
            <p className={styles.dataCardText}>
              Your data belongs to you, and our encryption ensures that
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}