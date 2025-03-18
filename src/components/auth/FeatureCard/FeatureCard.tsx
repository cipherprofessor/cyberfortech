// Since you're using Lucide icons, you can take advantage of their direct props
// This is a simpler approach if all your icons are from Lucide

import React, { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './FeatureCard.module.scss';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor?: string;
  delay?: number;
  className?: string;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  // Remove the hash
  hex = hex.replace('#', '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  iconColor = '#6366f1',
  delay = 0,
  className = ''
}) => {
  // Convert the hex color to RGB for the CSS variable
  const rgbColor = useMemo(() => hexToRgb(iconColor), [iconColor]);
  
  return (
    <motion.div 
      className={`${styles.featureCard} ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ 
        y: '-10px',
        transition: { duration: 0.3 }
      }}
      style={{ 
        color: iconColor,
        // Create a CSS variable with the RGB values for the box-shadow
        '--icon-rgb': rgbColor
      } as React.CSSProperties}
      data-feature-card="true"
      data-icon-color={iconColor}
    >
      <div className={styles.iconContainer} style={{ backgroundColor: `${iconColor}20` }}>
        <div className={styles.icon} style={{ color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className={styles.contentContainer}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;