// src/components/ForumCategories/ForumManagement/ForumManagement.tsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import styles from './ForumManagement.module.scss';
import { CategoryForm } from '../CategoryForm/CategoryForm';
import ForumRecentTopicTable from '@/components/ui/Mine/CustomTables/ForumRecentTopicTable';
import { useAuth } from '@/hooks/useAuth';
import { TopicData, TopicsResponse } from '@/types/forum';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  display_order: number;
  is_active: boolean;
  total_topics: number;
  total_posts: number;
  last_post_at?: string;
  subCategories: SubCategory[];
}

export function ForumManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const { isAdmin, isStudent } = useAuth();
  const [topicsData, setTopicsData] = useState<TopicsResponse>({
    topics: [] as TopicData[],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    }
  });

  // Fetch initial data
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

  const handleAddCategory = async (formData: any) => {
    try {
      const response = await axios.post('/api/forum/categories', formData);
      setCategories([...categories, { ...response.data, subCategories: [] }]);
      setIsAddingCategory(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create category';
      throw new Error(errorMessage);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`/api/forum/categories?id=${categoryId}`);
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
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

  if (loading) {
    return <div className={styles.loading}><Loader className={styles.spinner} /> Loading...</div>;
  }

  if (!isAdmin && !isStudent) {
    return <div className={styles.loading}>Access denied</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Forum Management</h1>
      
      {error && <div className={styles.error}>{error}</div>}

      {/* Categories Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Categories</h2>
          <button 
            className={styles.addButton}
            onClick={() => setIsAddingCategory(!isAddingCategory)}
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {isAddingCategory && (
          <CategoryForm
            onSubmit={handleAddCategory}
            onCancel={() => setIsAddingCategory(false)}
          />
        )}

        <div className={styles.categoriesList}>
          {categories.map(category => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryTitle}>
                  {category.icon && <span className={styles.icon}>{category.icon}</span>}
                  <h3>{category.name}</h3>
                  {!category.is_active && <span className={styles.inactiveLabel}>Inactive</span>}
                </div>
                <div className={styles.categoryStats}>
                  <span>{category.total_topics} topics</span>
                  <span>{category.total_posts} posts</span>
                </div>
                <div className={styles.categoryActions}>
                  <button 
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )}
                    className={styles.expandButton}
                  >
                    {expandedCategory === category.id ? 
                      <ChevronUp size={16} /> : 
                      <ChevronDown size={16} />
                    }
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {expandedCategory === category.id && (
                <div className={styles.categoryDetails}>
                  <p className={styles.description}>{category.description}</p>
                  <div className={styles.categoryMeta}>
                    <div>
                      <strong>Display Order:</strong> {category.display_order}
                    </div>
                    {category.color && (
                      <div className={styles.colorPreview}>
                        <strong>Color:</strong>
                        <span 
                          className={styles.colorBox}
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    )}
                  </div>
                  {category.subCategories.length > 0 && (
                    <div className={styles.subcategories}>
                      <h4>Subcategories</h4>
                      <ul>
                        {category.subCategories.map(sub => (
                          <li key={sub.id}>{sub.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Topics Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Topics</h2>
        </div>

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