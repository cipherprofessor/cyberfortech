//src/app/(routes)/forum/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  PlusCircle,
} from 'lucide-react';

import { ForumCategories } from '@/components/ForumCategories/ForumCategories';
import { ForumStats } from '@/components/ForumCategories/ForumStats/ForumStats';
import { NewTopicForm } from '@/components/ForumCategories/NewTopicForm/NewTopicForm';

import { TrendingReactions } from '@/components/Forum/TrendingReactions/TrendingReactions';
import { useAuth } from '@/hooks/useAuth';
import { 
  Category, 
  ForumStatsData
} from '@/types/forum';
import styles from './forum.module.scss';
import { Button } from '@heroui/button';
import ForumTable from '@/components/ForumCategories/ForumTable/ForumTable';

// Custom hook for responsive design
const useResponsiveBreakpoint = (breakpoint = 768) => {
  const [isBelow, setIsBelow] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelow(window.innerWidth < breakpoint);
    };
    
    // Initial check
    checkBreakpoint();
    
    // Add resize listener
    window.addEventListener('resize', checkBreakpoint);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return isBelow;
};

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [stats, setStats] = useState<ForumStatsData | null>(null);
  const [loading, setLoading] = useState({
    categories: true,
    stats: true,
  });
  const [error, setError] = useState('');
  
  // Get responsive breakpoints without needing to pass them to components
  const isMobile = useResponsiveBreakpoint(768);
  const isSmallScreen = useResponsiveBreakpoint(576);
  
  // Adjust categories per page based on screen size
  const CATEGORIES_PER_PAGE = isSmallScreen ? 2 : 3;
  
  const totalPages = Math.ceil((categories?.length || 0) / CATEGORIES_PER_PAGE);
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * CATEGORIES_PER_PAGE,
    categoryPage * CATEGORIES_PER_PAGE
  );

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get('/api/forum/categories');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handler for new topic creation
  const handleTopicCreated = async () => {
    // Refresh categories to get updated counts
    await fetchCategories();
    
    // Close the modal
    setIsTopicFormOpen(false);
  };

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!loading.categories) {
        try {
          console.log('Fetching stats...');
          const response = await axios.get('/api/forum/stats');
          console.log('Stats response:', response.data);
          setStats(response.data);
        } catch (err) {
          console.error('Error fetching stats:', err);
        } finally {
          setLoading(prev => ({ ...prev, stats: false }));
        }
      }
    };

    fetchStats();
  }, [loading.categories]);

  // Animations scaled for responsive layout
  const getAnimationDelay = (index) => {
    return isMobile ? 0.1 * index : 0.2 + (0.1 * index);
  };

  return (
    <motion.div 
      className={styles.pageContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      {/* Top Section with Forum Title and Stats */}
      <motion.div 
        className={styles.topSection}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Forum Title and Create Topic Button */}
        <div className={styles.headerSection}>
          <div className={styles.headerBackgroundEffects} />
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: getAnimationDelay(0), duration: 0.4 }}
              >
                Community Forum
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: getAnimationDelay(1), duration: 0.4 }}
              >
                Join the discussion with our community members
              </motion.p>
            </div>
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: getAnimationDelay(2), duration: 0.4 }}
              >
                <Button 
                  onClick={() => setIsTopicFormOpen(true)}
                  className={styles.newTopicButton}
                >
                  <PlusCircle size={16} />
                  <span className="sr-only">Create New Topic</span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Forum Stats with Skeleton */}
        <motion.div 
          className={styles.statsCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: getAnimationDelay(3), duration: 0.4 }}
        >
          {loading.stats ? (
            <div className={styles.statsSkeleton}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonStats}>
                <div className={styles.skeletonStat} />
                <div className={styles.skeletonStat} />
                <div className={styles.skeletonStat} />
                <div className={styles.skeletonStat} />
              </div>
            </div>
          ) : (
            stats && <ForumStats stats={stats} />
          )}
        </motion.div>
      </motion.div>

      {/* Middle Section with Categories and Trending */}
      <motion.div 
        className={styles.middleSection}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Categories with Skeleton */}
        <div className={styles.categoriesSection}>
          {loading.categories ? (
            <div className={styles.categorySkeleton}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonItems}>
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
              </div>
            </div>
          ) : (
            <ForumCategories 
              categories={paginatedCategories}
              currentPage={categoryPage}
              onPageChange={setCategoryPage}
              totalPages={totalPages}
              allCategories={categories}
            />
          )}
        </div>

        {/* Trending Reactions with Skeleton */}
        <div className={styles.trendingSection}>
          {loading.stats ? (
            <div className={styles.trendingSkeleton}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonItems}>
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
              </div>
            </div>
          ) : (
            <TrendingReactions />
          )}
        </div>
      </motion.div>

      {/* Bottom Section with Topics Table */}
      <motion.div 
        className={styles.tableSection}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <ForumTable />
      </motion.div>

      <NewTopicForm 
        isOpen={isTopicFormOpen}
        onClose={() => {
          setIsTopicFormOpen(false);
          setError('');  // Clear any errors
        }}
        categories={categories}
        onTopicCreated={handleTopicCreated}
      />

    </motion.div>
  );
}