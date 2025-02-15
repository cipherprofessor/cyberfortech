// ListCardContainer.tsx
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import styles from './ListCardContainer.module.scss';
import { ListCardCategory } from '../../lib/types';
import ListCard from './ListCard'; // Updated import name
import { View, ViewIcon } from 'lucide-react';

interface ListCardContainerProps {
  categories: ListCardCategory[];
  className?: string;
}

const ListCardContainer: React.FC<ListCardContainerProps> = ({ 
  categories,
  className = '' 
}) => {
  const { theme } = useTheme();
  const containerClass = `${styles.container} ${theme === 'dark' ? styles.dark : ''} ${className}`;

  return (
    <motion.div 
      className={containerClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <div className={styles.cardHeading}>
        <div className={styles.cardTitle}>
            Mohsin
            <div className={styles.cardButton}>
                <ViewIcon ></ViewIcon>
                </div>
            </div>
</div>
            
      {categories.map((category) => (
        <ListCard key={category.id} category={category} />
      ))}
    </motion.div>
  );
};

export default ListCardContainer;