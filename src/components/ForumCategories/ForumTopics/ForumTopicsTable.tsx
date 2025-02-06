// src/components/ForumCategories/ForumTopics/ForumTopicsTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ForumTopicsTable.module.scss';
import ForumRecentTopicTable from '@/components/ui/Mine/CustomTables/ForumRecentTopicTable';
import { useAuth } from '@/hooks/useAuth';
import { Category, TopicData, ApiTopic, TopicsResponse } from '@/types/forum';


interface ApiResponse {
    topics: ApiTopic[];
    pagination: TopicsResponse['pagination'];
  }
  

export function ForumTopicTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const { isAdmin, isStudent } = useAuth();
  
  // Use TopicData for the transformed data
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

  // Transform API response to match TopicData interface
  const transformApiToTopicData = (apiTopic: ApiTopic): TopicData => ({
    id: apiTopic.id,
    title: apiTopic.title,
    content: apiTopic.content || '',
    category_name: apiTopic.category_name,
    authorId: apiTopic.author_id,
    authorName: apiTopic.author_name,
    createdAt: apiTopic.created_at,
    is_pinned: apiTopic.is_pinned,
    is_locked: apiTopic.is_locked,
    replies_count: apiTopic.reply_count,
    views: apiTopic.views,
    categoryId: apiTopic.category_id,
    subcategory_id: apiTopic.subcategory_id,
    subcategory_name: apiTopic.subcategory_name,
    updatedAt: apiTopic.updated_at || apiTopic.created_at
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
      const response = await axios.get<ApiResponse>(
        `/api/forum/topics?page=${page}&limit=10`
      );
      
      // Transform the API response to match TopicData interface
      const transformedTopics = response.data.topics.map(transformApiToTopicData);
      
      setTopicsData({
        topics: transformedTopics,
        pagination: response.data.pagination
      });
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
      await axios.delete(`/api/forum/topics?id=${topicId}`);
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
      {error && <div className={styles.error}>{error}</div>}
      <section className={styles.section}>
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