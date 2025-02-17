import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  ShoppingBag, 
  Laptop, 
  ShoppingCart, 
  Car, 
  Package 
} from 'lucide-react';
import styles from './ListCardCategories.module.scss';

export type CategoryType = 'clothing' | 'electronics' | 'grocery' | 'automobiles' | 'others';

export interface CategoryData {
  id: string;
  name: string;
  sales: number;
  grossPercentage: number;
  changePercentage: number;
  type: CategoryType;
}

interface TopSellingCategoriesProps {
  data: CategoryData[];
  title?: string;
  className?: string;
  showIcons?: boolean;
  animated?: boolean;
  sortable?: boolean;
}

const getCategoryIcon = (type: CategoryType) => {
  const icons = {
    clothing: ShoppingBag,
    electronics: Laptop,
    grocery: ShoppingCart,
    automobiles: Car,
    others: Package
  };
  
  const Icon = icons[type];
  return <Icon size={20} />;
};

const TopSellingCategories: React.FC<TopSellingCategoriesProps> = ({
  data,
  title = "Top Selling Categories",
  className = "",
  showIcons = true,
  animated = true,
  sortable = true
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const overallChange = data.reduce((sum, item) => sum + item.changePercentage, 0) / data.length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className={`${styles.container} ${isDark ? styles.dark : ''} ${className}`}
      variants={containerVariants}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {sortable && (
          <button className={styles.sortButton}>
            Sort By
            <motion.span 
              className={styles.arrow}
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              ↓
            </motion.span>
          </button>
        )}
      </div>

      <div className={styles.statsBar}>
        {Array.from({ length: data.length }).map((_, index) => (
          <div 
            key={index}
            className={`${styles.barSegment} ${styles[`segment${index + 1}`]}`}
          />
        ))}
      </div>

      <div className={styles.overallStats}>
        <div className={styles.overallSales}>
          <span>Overall Sales</span>
          <span className={styles.totalValue}>{totalSales.toLocaleString()}</span>
          <motion.span 
            className={`${styles.change} ${overallChange >= 0 ? styles.positive : styles.negative}`}
          >
            {overallChange >= 0 ? '+' : ''}{overallChange.toFixed(2)}%
          </motion.span>
        </div>
        
      </div>

      <div className={styles.categoriesList}>
        {data.map((category, index) => (
          <motion.div
            key={category.id}
            className={styles.categoryItem}
            variants={itemVariants}
            custom={index}
          >
            {showIcons && (
              <div className={`${styles.iconWrapper} ${styles[`${category.type}Wrapper`]}`}>
                {getCategoryIcon(category.type)}
              </div>
            )}
            
            <div className={styles.categoryName}>{category.name}</div>
            
            <div className={styles.categoryStats}>
              <span className={styles.sales}>{category.sales.toLocaleString()}</span>
              <span className={styles.gross}>{category.grossPercentage}% Gross</span>
            </div>

            <motion.div 
              className={`${styles.changeLabel} ${category.changePercentage >= 0 ? styles.positive : styles.negative}`}
              whileHover={{ scale: 1.05 }}
            >
              {category.changePercentage >= 0 ? '+' : ''}{category.changePercentage}%
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopSellingCategories;