'use client';
// src/app/(routes)/forum/page.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { ForumCategories } from '@/components/ForumCategories/ForumCategories';
import { ForumStats } from '@/components/ForumCategories/ForumStats/ForumStats';
import { NewTopicForm } from '@/components/ForumCategories/NewTopicForm/NewTopicForm';
import ForumRecentTopicTable from '@/components/ui/Mine/CustomTables/ForumRecentTopicTable';
import { Category, ForumStatsData, TopicsResponse } from '@/types/forum';
import { useAuth } from '@/hooks/useAuth';
import styles from './forum.module.scss';

export default function ForumPage() {
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ForumStatsData | null>(null);
  const [topicsData, setTopicsData] = useState<TopicsResponse>({
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

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const [categoriesRes, statsRes, topicsRes] = await Promise.all([
          axios.get('/api/forum/categories'),
          axios.get('/api/forum/stats'),
          axios.get(`/api/forum/topics?page=${currentPage}&limit=10`)
        ]);

        setCategories(categoriesRes.data);
        setStats(statsRes.data);
        setTopicsData(topicsRes.data);
      } catch (err) {
        console.error('Error fetching forum data:', err);
        setError('Failed to load forum data');
      } finally {
        setLoading({
          categories: false,
          stats: false,
          topics: false
        });
      }
    };

    fetchForumData();
  }, [currentPage]);

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
        <Button 
          onClick={() => setIsTopicFormOpen(true)}
          className={styles.newTopicButton}
        >
          <PlusCircle size={16} />
          Create New Topic
        </Button>
      </div>

      {/* Mid Section - Categories and Stats */}
      <div className={styles.midSection}>
        {/* Left side - Categories */}
        <div className={styles.categoriesSection}>
          {loading.categories ? (
            <div className={styles.categoriesSkeleton}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
            </div>
          ) : (
            <ForumCategories categories={categories} />
          )}
        </div>

        {/* Right side - Stats */}
        <div className={styles.statsSection}>
          {loading.stats ? (
            <div className={styles.statsSkeleton}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonStat}></div>
              <div className={styles.skeletonStat}></div>
              <div className={styles.skeletonStat}></div>
            </div>
          ) : (
            stats && <ForumStats stats={stats} />
          )}
        </div>
      </div>

      {/* Topics Table Section */}
      <div className={styles.topicsSection}>
        {loading.topics ? (
          <div className={styles.tableSkeleton}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonRow}></div>
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

      {/* New Topic Form Modal */}
      <NewTopicForm 
        isOpen={isTopicFormOpen}
        onClose={() => setIsTopicFormOpen(false)}
        categories={categories}
      />
    </div>
  );
}