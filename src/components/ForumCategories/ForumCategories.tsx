// src/components/Forum/ForumCategories/ForumCategories.tsx
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  MessageSquare, 
  Users, 
  Hash,
  TrendingUp,
  Star,
  MessageCircle
} from 'lucide-react';
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

const iconVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: {
      duration: 0.2,
      yoyo: Infinity
    }
  }
};

export function ForumCategories({ categories, className }: ForumCategoriesProps) {
  // Sort categories by total topics
  const sortedCategories = [...categories].sort((a, b) => 
    (b.total_topics || 0) - (a.total_topics || 0)
  );

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

  const getActivityLevel = (topicCount: number = 0) => {
    if (topicCount >= 100) return 'high';
    if (topicCount >= 50) return 'medium';
    return 'low';
  };

  return (
    <motion.div 
      className={`${styles.categoriesContainer} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="wait">
        {sortedCategories.map((category, index) => (
          <motion.div
            key={category.id}
            className={`${styles.categoryCard} ${styles[getActivityLevel(category.total_topics)]}`}
            variants={categoryVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.02, y: -2 }}
            layout
          >
            <Link href={`/forum/categories/${category.id}`} className={styles.categoryLink}>
              <motion.div 
                className={styles.categoryHeader}
                layoutId={`category-${category.id}`}
              >
                <motion.div 
                  className={styles.categoryIcon}
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  {renderCategoryIcon(category)}
                  {index === 0 && (
                    <div className={styles.topCategory}>
                      <TrendingUp size={12} />
                      <span>Most Active</span>
                    </div>
                  )}
                </motion.div>

                <div className={styles.categoryInfo}>
                  <motion.h3 
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={styles.categoryTitle}
                  >
                    {category.name}
                    <ChevronRight size={16} className={styles.chevron} />
                  </motion.h3>
                  <p className={styles.categoryDescription}>{category.description}</p>

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
                          <MessageCircle size={12} />
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
                  <motion.div 
                    className={`${styles.statItem} ${styles.topicStat}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <MessageSquare size={14} />
                    <span>{category.total_topics?.toLocaleString() || 0}</span>
                    <span className={styles.statLabel}>Topics</span>
                  </motion.div>
                  <motion.div 
                    className={`${styles.statItem} ${styles.postStat}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Users size={14} />
                    <span>{category.total_posts?.toLocaleString() || 0}</span>
                    <span className={styles.statLabel}>Posts</span>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}