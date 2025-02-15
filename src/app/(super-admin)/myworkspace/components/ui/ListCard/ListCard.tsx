// ListCard.tsx
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import styles from './ListCard.module.scss';
import { ListCardProps } from '../../lib/types';

const ListCard: React.FC<ListCardProps> = ({ 
  category,
  className = '' 
}) => {
  const { theme } = useTheme();
  const { title, courseCount, price, icon, color } = category;
  const cardClass = `${styles.card} ${theme === 'dark' ? styles.dark : ''} ${className}`;

  return (
    
    <motion.div
      className={cardClass}
      style={{ '--accent-color': color } as React.CSSProperties}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
    
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.courseCount}>{courseCount.toLocaleString()} + Courses</p>
      </div>
      <div className={styles.price}>${price.toFixed(2)}</div>
    </motion.div>
  );
};

export default ListCard;