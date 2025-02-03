'use client';
import React, { useState, useEffect } from 'react';
// import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader, ChevronLeft, ChevronRight, User, MessageSquare } from 'lucide-react';
import styles from './ForumManagement.module.scss';
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



  export function ForumManagement() {
    // const { userId } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const currentPageNum = topicsData.pagination.page;
    const totalPages = topicsData.pagination.pages;

    // Always show first page
    pages.push(1);

    // Add ellipsis and surrounding pages
    for (let i = Math.max(2, currentPageNum - 1); i <= Math.min(totalPages - 1, currentPageNum + 1); i++) {
      if (i === 2 && currentPageNum > 3) pages.push('...');
      pages.push(i);
      if (i === currentPageNum + 1 && currentPageNum < totalPages - 2) pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  if (loading) {
    return <div className={styles.loading}><Loader className={styles.spinner} /> Aajjaaa</div>;
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

 {/* Enhanced Topics Section */}
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