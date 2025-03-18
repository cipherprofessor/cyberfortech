'use client';

import React, { useEffect, useState } from 'react';
import { SignIn } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Layers, BarChart, Users, Clock } from 'lucide-react';

import styles from './page.module.scss';
import FeatureCard from '../../FeatureCard/FeatureCard';

export default function SignInPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle hydration issues and loading state
  useEffect(() => {
    setIsMounted(true);
    
    // Simulate loading time or wait for clerk to be ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust this time as needed
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  // Define colors for better consistency
  const purpleColor = "#6366F1";
  const yellowColor = "#F59E0B";
  const greenColor = "#10B981";
  const pinkColor = "#EC4899";
  
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
          
          <div className={`${styles.clerkSignInWrapper} ${styles.signInSpacing}`}>
            {isLoading ? (
              <div className={styles.skeletonLoader}>
                <div className={styles.socialButtonsSkeleton}>
                  <div className={styles.buttonSkeleton}></div>
                  <div className={styles.buttonSkeleton}></div>
                  <div className={styles.buttonSkeleton}></div>
                </div>
                <div className={styles.dividerSkeleton}>
                  <div className={styles.dividerLine}></div>
                  <div className={styles.dividerText}></div>
                  <div className={styles.dividerLine}></div>
                </div>
                <div className={styles.inputSkeleton}></div>
                <div className={styles.buttonSkeleton}></div>
              </div>
            ) : (
              <SignIn 
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
                    footer: {
                      display: 'none', // Hide the entire footer
                    },
                    socialButtonsBlockButton: {
                      borderRadius: '0.75rem',
                      height: '44px',
                    },
                    dividerText: {
                      fontSize: '0.75rem',
                    },
                    formFieldInput: {
                      height: '44px',
                    },
                  }
                }}
                routing="path"
                path="/sign-in"
                redirectUrl="/dashboard"
                signUpUrl="/sign-up"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Right side - Feature Cards */}
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
          <div className={styles.featureCardsContainer}>
            {/* Pass colors directly to both the icon and the FeatureCard */}
            <FeatureCard
              icon={<Layers size={24} color={purpleColor} />}
              title="Learn at your own pace"
              description="Access comprehensive cybersecurity courses anytime, anywhere"
              iconColor={purpleColor}
              delay={0.5}
            />
            
            <FeatureCard
              icon={<BarChart size={24} color={yellowColor} />}
              title="Track your progress"
              description="Monitor your skill development with detailed analytics"
              iconColor={yellowColor}
              delay={0.7}
            />
            
            <FeatureCard
              icon={<Users size={24} color={greenColor} />}
              title="Join our community"
              description="Connect with peers and industry experts in cybersecurity"
              iconColor={greenColor}
              delay={0.9}
            />
            
            <FeatureCard
              icon={<Clock size={24} color={pinkColor} />}
              title="Always up-to-date"
              description="Stay current with the latest cybersecurity trends and techniques"
              iconColor={pinkColor}
              delay={1.1}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}