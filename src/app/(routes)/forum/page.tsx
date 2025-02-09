// src/app/(routes)/forum/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  PlusCircle,
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
  const CATEGORIES_PER_PAGE = 3;
  const totalPages = Math.ceil((categories?.length || 0) / CATEGORIES_PER_PAGE);
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * CATEGORIES_PER_PAGE,
    categoryPage * CATEGORIES_PER_PAGE
  );

  // Calculate category pagination
  const totalCategoryPages = Math.ceil((categories?.length || 0) / CATEGORIES_PER_PAGE);

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
   // Function to fetch categories
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

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handler for new topic creation
  const handleTopicCreated = async () => {
    // Refresh categories to get updated counts
    await fetchCategories();
    
    // Refresh topics list
    // await fetchTopics();
    
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
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Community Forum
      </motion.h1>
      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Join the discussion with our community members
      </motion.p>
    </div>
    {isAuthenticated && (
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
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
  </div>
</div>

  {/* Forum Stats with Skeleton */}
  <motion.div 
    className={styles.statsCard}
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.4 }}
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
  transition={{ delay: 0.3, duration: 0.4 }}
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
  transition={{ delay: 0.4, duration: 0.4 }}
>
  <ForumRecentTopicTable
    topics={topicsData.topics}
    onDelete={handleDeleteTopic}
    loading={loading.topics}
    pagination={topicsData.pagination}
    onPageChange={setCurrentPage}
  />
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