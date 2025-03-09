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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  LayoutGrid
} from 'lucide-react';
import { Category } from '@/types/forum';
import styles from './ForumCategories.module.scss';

interface ForumCategoriesProps {
  categories: Category[];
  className?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  allCategories: Category[];
}

const categoryVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.1 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

export function ForumCategories({ 
  categories, 
  className,
  currentPage,
  onPageChange,
  totalPages,
  allCategories,
}: ForumCategoriesProps) {
  // Sort all categories by total_topics
  const sortedAllCategories = [...allCategories].sort((a, b) => 
    (b.total_topics || 0) - (a.total_topics || 0)
  );

  // Find the category with the most topics
  const topCategory = sortedAllCategories[0];

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
    <div className={styles.categoriesWrapper}>
      <div className={styles.header}>
        <h2>
          <LayoutGrid size={18} />
          Categories
        </h2>
        <div className={styles.paginationControls}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            <ChevronLeft size={16} />
          </motion.button>
          <span className={styles.pageInfo}>
            {currentPage} / {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            <ChevronRightIcon size={16} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          className={`${styles.categoriesContainer} ${className || ''}`}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className={`${styles.categoryCard} ${styles[
                category.total_topics >= 100 ? 'high' : 
                category.total_topics >= 50 ? 'medium' : 'low'
              ]}`}
              variants={categoryVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Link href={`/forum/categories/${category.id}`} className={styles.categoryLink}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    {renderCategoryIcon(category)}
                  </div>

                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryTitle}>
                      {category.name}
                      <ChevronRight size={16} className={styles.chevron} />
                    </h3>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>

                  <div className={styles.categoryStats}>
                    {category.id === topCategory.id && (
                      <div className={styles.trending}>
                        <TrendingUp size={12} />
                        <span>Trending</span>
                      </div>
                    )}
                    <div className={`${styles.statItem} ${styles.topicStat}`}>
                      <MessageSquare />
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>
                          {category.total_topics?.toLocaleString() || 0}
                        </span>
                        <span className={styles.statLabel}>Topics</span>
                      </div>
                    </div>
                    <div className={`${styles.statItem} ${styles.postStat}`}>
                      <Users />
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>
                          {category.total_posts?.toLocaleString() || 0}
                        </span>
                        <span className={styles.statLabel}>Posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ForumCategories;