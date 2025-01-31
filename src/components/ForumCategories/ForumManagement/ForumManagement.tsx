'use client';
// src/components/Forum/ForumManagement/ForumManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import styles from './ForumManagement.module.scss';

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

interface Topic {
  id: number;
  title: string;
  authorId: string;
  categoryId: number;
  createdAt: string;
}

interface TopicsResponse {
    topics: Topic[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }

export function ForumManagement() {
  const { userId } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [topicsData, setTopicsData] = useState<TopicsResponse>({
    topics: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    }
  });

  // Fetch categories and topics
  useEffect(() => {
    fetchCategories();
    fetchTopics();
  }, []);

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

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/forum/topics');
      setTopicsData(response.data);
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/forum/categories', newCategory);
      setCategories([...categories, { ...response.data, subCategories: [] }]);
      setNewCategory({ name: '', description: '', icon: '' });
      setIsAddingCategory(false);
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
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
    } catch (err) {
      setError('Failed to delete topic');
      console.error(err);
    }
  };

  if (loading) {
    return <div className={styles.loading}><Loader className={styles.spinner} /> Loading...</div>;
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
          <form onSubmit={handleAddCategory} className={styles.addForm}>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={e => setNewCategory({...newCategory, name: e.target.value})}
              className={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={e => setNewCategory({...newCategory, description: e.target.value})}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Icon (optional)"
              value={newCategory.icon || ''}
              onChange={e => setNewCategory({...newCategory, icon: e.target.value})}
              className={styles.input}
            />
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>Create</button>
              <button 
                type="button" 
                onClick={() => setIsAddingCategory(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.categoriesList}>
          {categories.map(category => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryTitle}>
                  {category.icon && <span className={styles.icon}>{category.icon}</span>}
                  <h3>{category.name}</h3>
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
        <h2>Recent Topics</h2>
        <div className={styles.topicsList}>
          {topicsData.topics.map(topic => (
            <div key={topic.id} className={styles.topicItem}>
              <div className={styles.topicTitle}>
                <h4>{topic.title}</h4>
                <span className={styles.topicDate}>
                  {new Date(topic.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.topicActions}>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Information */}
        {topicsData.pagination.pages > 1 && (
          <div className={styles.pagination}>
            <span>
              Page {topicsData.pagination.page} of {topicsData.pagination.pages}
            </span>
            <span>
              Total topics: {topicsData.pagination.total}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}