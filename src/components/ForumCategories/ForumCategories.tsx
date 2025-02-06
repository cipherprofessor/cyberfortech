// src/components/Forum/ForumCategories/ForumCategories.tsx
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MessageSquare, Users, Hash } from 'lucide-react';
import { Category } from '@/types/forum';
import styles from './ForumCategories.module.scss';

interface ForumCategoriesProps {
  categories: Category[];
  className?: string;
}

const categoryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ForumCategories({ categories, className }: ForumCategoriesProps) {
  const renderCategoryIcon = (category: Category) => {
    if (!category.icon) {
      return <Hash className={styles.defaultIcon} />;
    }

    if (category.icon.startsWith('http')) {
      return (
        <img 
          src={category.icon} 
          alt={category.name} 
          className={styles.iconImage}
        />
      );
    }

    return (
      <div 
        className={styles.iconSvg}
        dangerouslySetInnerHTML={{ __html: category.icon }}
      />
    );
  };

  return (
    <motion.div 
      className={`${styles.categoriesContainer} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="wait">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className={styles.categoryCard}
            variants={categoryVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.02 }}
            layout
          >
            <motion.div 
              className={styles.categoryHeader}
              layoutId={`category-${category.id}`}
            >
              <div className={styles.categoryIcon}>
                {renderCategoryIcon(category)}
              </div>

              <div className={styles.categoryInfo}>
                <Link href={`/forum/categories/${category.id}`}>
                  <motion.h3 
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {category.name}
                    <ChevronRight size={16} className={styles.chevron} />
                  </motion.h3>
                </Link>
                <p>{category.description}</p>

                {category.subCategories?.length > 0 && (
                  <motion.div 
                    className={styles.subCategories}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {category.subCategories.slice(0, 3).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/forum/categories/${category.id}/${sub.id}`}
                        className={styles.subCategory}
                      >
                        {sub.name}
                      </Link>
                    ))}
                    {category.subCategories.length > 3 && (
                      <span className={styles.moreSubCategories}>
                        +{category.subCategories.length - 3} more
                      </span>
                    )}
                  </motion.div>
                )}
              </div>

              <div className={styles.categoryStats}>
                <div className={styles.statItem}>
                  <MessageSquare size={14} />
                  <span>{category.totalTopics?.toLocaleString() || 0}</span>
                </div>
                <div className={styles.statItem}>
                  <Users size={14} />
                  <span>{category.totalPosts?.toLocaleString() || 0}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}