'use client';

import React, { useEffect, useState } from 'react';
import { SignUp } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import styles from './page.module.scss';

export default function SignUpPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
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
            <span>Already a member?</span>
            <Link href="/sign-in" className={styles.signInLink}>
              Sign in
            </Link>
          </div>
        </div>
        
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>Secure Your Cybersecurity Journey with CyberFort</p>
          
          <div className={styles.clerkSignUpWrapper}>
            <SignUp 
              appearance={{
                elements: {
                  rootBox: {
                    width: '100%',
                    boxShadow: 'none',
                  },
                  card: {
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    border: 'none',
                  },
                  headerTitle: {
                    display: 'none',
                  },
                  headerSubtitle: {
                    display: 'none',
                  },
                  formButtonPrimary: {
                    boxShadow: '0 4px 6px rgba(59, 131, 246, 0.2)',
                  },
                  footerAction: {
                    marginTop: '1.5rem',
                  },
                }
              }}
              routing="path"
              path="/sign-up"
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <motion.div 
        className={styles.illustrationSide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div 
            className={styles.metricsCard}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className={styles.metricsHeader}>
              <span className={styles.metricsTitle}>Your Learning Inbox</span>
              <span className={styles.metricsValue}>176</span>
            </div>
            <div className={styles.chart}>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className={styles.chartLine}
              >
                <svg width="100%" height="80" viewBox="0 0 400 80">
                  <path d="M0,40 C40,20 80,60 120,40 S200,10 240,40 S320,70 360,40 L360,80 L0,80 Z" fill="rgba(99, 102, 241, 0.3)" />
                  <path d="M0,40 C40,20 80,60 120,40 S200,10 240,40 S320,70 360,40" stroke="#a5b4fc" fill="none" strokeWidth="3" />
                  <path d="M0,60 C60,40 120,80 180,60 S300,30 360,60" stroke="#f59e0b" fill="none" strokeWidth="3" />
                </svg>
              </motion.div>
              <div className={styles.chartBadge}>45</div>
            </div>
          </motion.div>
          
          <div className={styles.socialIcons}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className={styles.iconCircle}
              whileHover={{ y: -5, rotate: 10, transition: { duration: 0.3 } }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7615 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 6.5H17.51" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className={styles.iconCircle}
              whileHover={{ y: -5, rotate: -10, transition: { duration: 0.3 } }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
          
          <motion.div
            className={styles.dataCard}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className={styles.dataCardIcon}>
              <Shield size={24} color="#a5b4fc" />
            </div>
            <h3 className={styles.dataCardTitle}>Your data, your rules</h3>
            <p className={styles.dataCardText}>
              Your data belongs to you, and our encryption ensures that all your learning progress and personal information remains secure and private.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}