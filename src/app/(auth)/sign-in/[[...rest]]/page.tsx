'use client';

import React from 'react';
import { SignIn } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './page.module.scss';

export default function SignInPage() {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  return (
    <div className={styles.signinContainer}>
      {/* Left side - SignIn form */}
      <div className={styles.formSide}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className={styles.needAccount}>
            <span>Need an account?</span>
            <Link href="/sign-up" className={styles.signUpLink}>
              Sign up
            </Link>
          </div>
        </div>
        
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Welcome back to CyberFort</p>
          
          <div className={styles.clerkSignInWrapper}>
            <SignIn 
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
                    display: 'none', // Hide the "Sign up" link at the bottom
                  },
                }
              }}
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
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
          <h2 className={styles.tagline}>Welcome back to CyberFort Tech</h2>
          <p className={styles.description}>
            Access your courses, track your progress, and connect with fellow learners.
          </p>
          
          <motion.div 
            className={styles.featureCard}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Learn at your own pace</h3>
            <p>Access courses anytime, anywhere</p>
          </motion.div>
          
          <motion.div 
            className={styles.featureCard}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16L16 12L12 8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Track your progress</h3>
            <p>View your achievements and improvements</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}