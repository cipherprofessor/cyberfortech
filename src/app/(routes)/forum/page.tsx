// src/app/(routes)/forum/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  BarChart,
  TrendingUp
} from 'lucide-react';

import { ForumCategories } from '@/components/ForumCategories/ForumCategories';
import { ForumStats } from '@/components/ForumCategories/ForumStats/ForumStats';
import { NewTopicForm } from '@/components/ForumCategories/NewTopicForm/NewTopicForm';
import ForumRecentTopicTable from '@/components/ui/Mine/CustomTables/ForumRecentTopicTable';
import { TrendingReactions } from '@/components/Forum/TrendingReactions/TrendingReactions';
import { useAuth } from '@/hooks/useAuth';
import { 
  Category, 
  ForumStatsData, 
  TopicsResponse, 
  ApiTopic, 
  TopicData 
} from '@/types/forum';
import styles from './forum.module.scss';
import { Button } from '@heroui/button';

const CATEGORIES_PER_PAGE = 3;

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [stats, setStats] = useState<ForumStatsData | null>(null);
  const [topicsData, setTopicsData] = useState<{
    topics: TopicData[];
    pagination: TopicsResponse['pagination'];
  }>({
    topics: [],
    pagination: { total: 0, page: 1, limit: 10, pages: 0 }
  });
  const [loading, setLoading] = useState({
    categories: true,
    stats: true,
    topics: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  // Calculate category pagination
  const totalCategoryPages = Math.ceil((categories?.length || 0) / CATEGORIES_PER_PAGE);
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * CATEGORIES_PER_PAGE,
    categoryPage * CATEGORIES_PER_PAGE
  );

  const transformApiToTopicData = (apiTopic: ApiTopic): TopicData => ({
    id: apiTopic.id,
    title: apiTopic.title,
    content: apiTopic.content || '',
    category_name: apiTopic.category_name,
    categoryId: apiTopic.category_id,
    authorId: apiTopic.author_id,
    authorName: apiTopic.author_name,
    createdAt: apiTopic.created_at,
    updatedAt: apiTopic.updated_at || apiTopic.created_at,
    is_pinned: apiTopic.is_pinned,
    is_locked: apiTopic.is_locked,
    replies_count: apiTopic.reply_count,
    views: apiTopic.views,
    subcategory_id: apiTopic.subcategory_id,
    subcategory_name: apiTopic.subcategory_name
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
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
    };

    fetchCategories();
  }, []);

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

  // Fetch Topics
  useEffect(() => {
    const fetchTopics = async () => {
      if (!loading.stats) {
        try {
          console.log('Fetching topics...');
          setLoading(prev => ({ ...prev, topics: true }));
          const response = await axios.get<{ topics: ApiTopic[], pagination: TopicsResponse['pagination'] }>(
            `/api/forum/topics?page=${currentPage}&limit=10`
          );
          console.log('Topics response:', response.data);
          
          setTopicsData({
            topics: response.data.topics.map(transformApiToTopicData),
            pagination: response.data.pagination
          });
        } catch (err) {
          console.error('Error fetching topics:', err);
        } finally {
          setLoading(prev => ({ ...prev, topics: false }));
        }
      }
    };

    fetchTopics();
  }, [currentPage, loading.stats]);

  const handleDeleteTopic = async (topicId: number) => {
    try {
      await axios.delete(`/api/forum/topics?id=${topicId}`);
      setTopicsData(prev => ({
        ...prev,
        topics: prev.topics.filter(topic => topic.id !== topicId),
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total - 1
        }
      }));
    } catch (err) {
      console.error('Error deleting topic:', err);
    }
  };

  // Rest of the component remains the same...
  return (
    <motion.div 
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div 
        className={styles.headerSection}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.headerContent}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Community Forum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Join the discussion with our community members
          </motion.p>
        </div>
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button 
              onClick={() => setIsTopicFormOpen(true)}
              className={styles.newTopicButton}
            >
              <PlusCircle size={16} />
              Create New Topic
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column - Categories and Topics */}
        <div className={styles.categoriesColumn}>
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={styles.cardHeader}>
              <h2>
                <LayoutGrid size={20} />
                Categories
              </h2>
              <div className={styles.paginationControls}>
                <div className={styles.pageButtons}>
                  <button
                    onClick={() => setCategoryPage(p => Math.max(1, p - 1))}
                    disabled={categoryPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className={styles.pageInfo}>
                    {categoryPage} / {totalCategoryPages}
                  </span>
                  <button
                    onClick={() => setCategoryPage(p => Math.min(totalCategoryPages, p + 1))}
                    disabled={categoryPage === totalCategoryPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading.categories ? (
                <div className={styles.categorySkeleton}>
                  <div className={styles.skeletonHeader} />
                  <div className={styles.skeletonBody} />
                </div>
              ) : (
                <ForumCategories 
                  categories={paginatedCategories}
                  className={styles.categoriesGrid}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Topics Section */}
          <motion.div 
            className={`${styles.card} ${styles.topicsSection}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ForumRecentTopicTable
              topics={topicsData.topics}
              onDelete={handleDeleteTopic}
              loading={loading.topics}
              pagination={topicsData.pagination}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        </div>

        {/* Right Column - Stats and Trending */}
        <div className={styles.statsColumn}>
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className={styles.cardHeader}>
              <h2>
                <BarChart size={20} />
                Forum Statistics
              </h2>
            </div>
            {loading.stats ? (
              <div className={styles.categorySkeleton}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonBody} />
              </div>
            ) : (
              stats && <ForumStats stats={stats} />
            )}
          </motion.div>

          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className={styles.cardHeader}>
              <h2>
                <TrendingUp size={20} />
                Trending Reactions
              </h2>
            </div>
            <TrendingReactions />
          </motion.div>
        </div>
      </div>

      <NewTopicForm 
        isOpen={isTopicFormOpen}
        onClose={() => setIsTopicFormOpen(false)}
        categories={categories}
      />
    </motion.div>
  );
}