'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ForumTopicsTable.module.scss';
import ForumRecentTopicTable from '@/components/ui/Mine/CustomTables/ForumRecentTopicTable';
import { useAuth } from '@/hooks/useAuth';


interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
  subCategories: SubCategory[];
}

export interface TopicData {
  id: number;
  title: string;
  content: string;
  category_name: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
  is_pinned: boolean;
  is_locked: boolean;
  replies_count: number;
  views: number;
  categoryId: number;
  subcategory_id?: number;
  subcategory_name?: string;
  updatedAt: string;
}

export interface TopicsResponse {
  topics: TopicData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}



  export function ForumTopicTable() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const { isAdmin, isStudent } = useAuth(); // Use useAuth instead of direct Clerk hooks
    const [topicsData, setTopicsData] = useState<TopicsResponse>({
      topics: [] as TopicData[],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        await Promise.all([
          fetchCategories(),
          fetchTopics(currentPage)
        ]);
      } catch (err) {
        console.error('Error in loadData:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/forum/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (page = 1) => {
    try {
      setIsLoadingTopics(true);
      const response = await axios.get<TopicsResponse>(`/api/forum/topics?page=${page}&limit=10`);
      setTopicsData(response.data);
    } catch (err) {
      console.error('Error in fetchTopics:', err);
      setError('Failed to load topics');
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    try {
      const response = await axios.delete(`/api/forum/topics?id=${topicId}`);
      console.log('Delete response:', response.data);
      
      setTopicsData(prev => ({
        ...prev,
        topics: prev.topics.filter(topic => topic.id !== topicId)
      }));
    } catch (err: any) {
      console.error('Delete error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to delete topic');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAdmin && !isStudent) {
    return <div className={styles.loading}>Access denied</div>;
  }

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>Forum Management</h1> */}
      
      {error && <div className={styles.error}>{error}</div>}

<section className={styles.section}>
        {/* <div className={styles.sectionHeader}>
          <h2>Recent Topics</h2>
        </div> */}

        <ForumRecentTopicTable
          topics={topicsData.topics}
          onDelete={handleDeleteTopic}
          loading={isLoadingTopics}
          pagination={topicsData.pagination}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
}