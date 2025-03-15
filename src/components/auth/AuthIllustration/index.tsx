import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

// Types
import { AuthIllustrationProps } from '../types';

// Styles
import styles from './AuthIllustration.module.scss';

const AuthIllustration: React.FC<AuthIllustrationProps> = ({
  backgroundImage = '/images/auth-bg.jpg',
  brandTagline = 'Empowering knowledge through technology',
  description = 'Join our community of learners and unlock exclusive content and resources.',
  className = ''
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const imageSideClass = `${styles.imageSide} ${isDarkTheme ? styles.darkTheme : ''} ${className}`;

  return (
    <motion.div 
      className={imageSideClass}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={styles.tagline}>{brandTagline}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </motion.div>
  );
};

export default AuthIllustration;