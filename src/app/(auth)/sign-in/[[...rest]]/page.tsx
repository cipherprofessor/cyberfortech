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
  
  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Add this effect to fix any remaining color issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fixIconColors = () => {
        document.querySelectorAll('[data-feature-card="true"]').forEach(card => {
          const iconColor = card.getAttribute('data-icon-color');
          if (iconColor) {
            // Force SVG colors inside this card
            card.querySelectorAll('svg').forEach(svg => {
              svg.setAttribute('color', iconColor);
              svg.style.color = iconColor;
            });
          }
        });
      };
      
      // Run the fix after a delay to ensure DOM is fully rendered
      setTimeout(fixIconColors, 100);
      // Also run it immediately
      fixIconColors();
    }
  }, [isMounted]); // Run when component mounts
  
  if (!isMounted) {
    return null;
  }
  
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
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    border: 'none',
                  },
                  // ... other appearance settings
                }
              }}
              routing="path"
              path="/sign-in"
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
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
            {/* Pass explicit color prop to Lucide icons */}
            <FeatureCard
              icon={<Layers size={24} color="#6366F1" />}
              title="Learn at your own pace"
              description="Access comprehensive cybersecurity courses anytime, anywhere"
              iconColor="#6366F1"
              delay={0.5}
            />
            
            <FeatureCard
              icon={<BarChart size={24} color="#F59E0B" />}
              title="Track your progress"
              description="Monitor your skill development with detailed analytics"
              iconColor="#F59E0B"
              delay={0.7}
            />
            
            <FeatureCard
              icon={<Users size={24} color="#10B981" />}
              title="Join our community"
              description="Connect with peers and industry experts in cybersecurity"
              iconColor="#10B981"
              delay={0.9}
            />
            
            <FeatureCard
              icon={<Clock size={24} color="#EC4899" />}
              title="Always up-to-date"
              description="Stay current with the latest cybersecurity trends and techniques"
              iconColor="#EC4899"
              delay={1.1}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}