"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Hammer, Cog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './ConstructionPage.module.scss';

const UnderConstruction = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        {/* Header */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={styles.iconContainer}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Cog className={styles.rotatingCog} />
            </motion.div>
            <Construction className={styles.constructionIcon} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.title}
        >
          Under Construction
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={styles.description}
        >
          We're working hard to bring you something amazing! This page is currently under construction and will be available soon.
        </motion.p>

        {/* Animation Elements */}
        <motion.div 
          className={styles.animationContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Hammer className={styles.icon} />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: 360
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Cog className={styles.icon} />
          </motion.div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          className={styles.buttonContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => router.back()}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.buttonIcon} />
            <span>Go Back</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnderConstruction;