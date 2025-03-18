import React, { ReactNode, useMemo, useRef, useEffect } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique ID for this specific card
  const uniqueId = useMemo(() => `card-${Math.random().toString(36).substring(2, 9)}`, []);
  
  // Set custom properties directly on the DOM element for better browser support
  useEffect(() => {
    if (cardRef.current) {
      // Set the unique ID as a data attribute
      cardRef.current.setAttribute('data-card-id', uniqueId);
      
      // Apply direct styling for pseudo-elements using a dedicated stylesheet for this card
      const styleTag = document.createElement('style');
      
      styleTag.textContent = `
        [data-card-id="${uniqueId}"] {
          color: ${iconColor} !important;
        }
        
        [data-card-id="${uniqueId}"]::before {
          background: ${iconColor} !important;
        }
        
        [data-card-id="${uniqueId}"]:hover {
          border-color: ${iconColor} !important;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(${rgbColor}, 0.3) !important;
        }
        
        [data-card-id="${uniqueId}"] .${styles.iconContainer}::after {
          box-shadow: 0 0 0 2px ${iconColor} !important;
        }
        
        [data-card-id="${uniqueId}"]:hover .${styles.iconContainer}::after {
          box-shadow: 0 0 0 2px ${iconColor}, 0 0 15px ${iconColor} !important;
        }
        
        [data-card-id="${uniqueId}"] .${styles.icon} {
          color: ${iconColor} !important;
        }
        
        [data-card-id="${uniqueId}"] .${styles.icon} svg {
          color: ${iconColor} !important;
          stroke: ${iconColor} !important;
        }
        
        [data-card-id="${uniqueId}"] .${styles.iconContainer} {
          background-color: ${iconColor}20 !important;
        }
      `;
      
      // Append the dedicated stylesheet to the head
      document.head.appendChild(styleTag);
      
      // Clean up function to remove the stylesheet when component unmounts
      return () => {
        document.head.removeChild(styleTag);
      };
    }
  }, [uniqueId, iconColor, rgbColor]);
  
  return (
    <motion.div 
      ref={cardRef}
      className={`${styles.featureCard} ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ 
        y: '-10px',
        transition: { duration: 0.3 }
      }}
      data-card-id={uniqueId}
      data-feature-card="true"
      data-icon-color={iconColor}
    >
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
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