// ListCardContainer.tsx
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import styles from './ListCardContainer.module.scss';
import { ListCardCategory, ListCardContainerProps } from '../../lib/types';
import ListCard from './ListCard';
import { ViewIcon } from 'lucide-react';



const ListCardContainer: React.FC<ListCardContainerProps> = ({ 
  categories,
  className = '',
  title = 'Categories',
  button = <ViewIcon />,
  onButtonClick
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
          {title}
          <div className={styles.cardButton} onClick={onButtonClick}>
            {button}
          </div>
        </div>
      </div>
      
      <div className={styles.cardsContainer}>
        {categories.map((category) => (
          <ListCard key={category.id} category={category} />
        ))}
      </div>
    </motion.div>
  );
};

export default ListCardContainer;