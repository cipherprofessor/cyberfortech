// src/app/(routes)/forum/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
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

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ForumStatsData | null>(null);
  const [topicsData, setTopicsData] = useState<{
    topics: TopicData[];
    pagination: TopicsResponse['pagination'];
  }>({
    topics: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    }
  });
  const [loading, setLoading] = useState({
    categories: true,
    stats: true,
    topics: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

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
        topics: prev.topics.filter(topic => topic.id !== topicId)
      }));
    } catch (err) {
      console.error('Error deleting topic:', err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1>Community Forum</h1>
          <p>Join the discussion with our community members</p>
        </div>
        {isAuthenticated && (
          <Button 
            onClick={() => setIsTopicFormOpen(true)}
            className={styles.newTopicButton}
          >
            <PlusCircle size={16} />
            Create New Topic
          </Button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainContent}>
        {/* Left Column - Categories */}
        <div className={styles.categoriesSection}>
          {loading.categories ? (
            <div className={styles.categoriesSkeleton}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
            </div>
          ) : (
            <ForumCategories categories={categories} />
          )}
        </div>

        {/* Center Column - Topics */}
        <div className={styles.topicsSection}>
          {loading.topics ? (
            <div className={styles.tableSkeleton}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonRow}></div>
              <div className={styles.skeletonRow}></div>
            </div>
          ) : (
            <ForumRecentTopicTable
              topics={topicsData.topics}
              onDelete={handleDeleteTopic}
              loading={loading.topics}
              pagination={topicsData.pagination}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Right Column - Stats & Trending */}
        <div className={styles.sideSection}>
          <div className={styles.statsCard}>
            {loading.stats ? (
              <div className={styles.statsSkeleton}>
                <div className={styles.skeletonHeader}></div>
                <div className={styles.skeletonStat}></div>
                <div className={styles.skeletonStat}></div>
              </div>
            ) : (
              stats && <ForumStats stats={stats} />
            )}
          </div>
          <div className={styles.trendingCard}>
            <TrendingReactions />
          </div>
        </div>
      </div>

      {/* New Topic Form Modal */}
      <NewTopicForm 
        isOpen={isTopicFormOpen}
        onClose={() => setIsTopicFormOpen(false)}
        categories={categories}
      />
    </div>
  );
}