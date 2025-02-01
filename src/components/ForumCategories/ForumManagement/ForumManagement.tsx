'use client';
// src/components/Forum/ForumManagement/ForumManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader, ChevronLeft, ChevronRight, User, MessageSquare } from 'lucide-react';
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
    content: string;
    views: number;
    is_pinned: boolean;
    is_locked: boolean;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    authorName?: string;
    authorAvatarUrl?: string;
    categoryId: number;
    category_name: string;
    subcategoryId?: number;
    subcategory_name?: string;
    replies_count?: number;
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [topicsData, setTopicsData] = useState<TopicsResponse>({
      topics: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    });

    useEffect(() => {
        console.log('useEffect triggered, currentPage:', currentPage);
        const loadData = async () => {
          try {
            setLoading(true);
            setError('');
            console.log('Starting data fetch...');
            
            await fetchCategories();
            await fetchTopics(currentPage);
            
            console.log('Data fetch complete');
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
      console.log('fetchTopics called with page:', page);
      setIsLoadingTopics(true);
      
      const url = `/api/forum/topics?page=${page}&limit=10`;
      console.log('Making request to:', url);
      
      const response = await axios.get(url);
      console.log('Got response:', response.data);
      
      setTopicsData(response.data);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching topics:', err);
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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > topicsData.pagination.pages) return;
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
 <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Topics</h2>
        </div>

        {isLoadingTopics ? (
          <div className={styles.loading}><Loader className={styles.spinner} /> Loading topics...</div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.topicsTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topicsData.topics.map(topic => (
                    <tr key={topic.id} className={styles.topicRow}>
                      <td className={styles.topicTitleCell}>
                        <div className={styles.topicTitle}>
                          <MessageSquare size={16} className={styles.topicIcon} />
                          <span>{topic.title}</span>
                        </div>
                      </td>
                      <td>{topic.category_name}</td>
                      <td>
                        <div className={styles.authorInfo}>
                          <User size={16} className={styles.authorIcon} />
                          <span>{topic.authorId}</span>
                        </div>
                      </td>
                      <td>
                        {new Date(topic.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className={styles.deleteButton}
                            title="Delete topic"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {topicsData.pagination.pages > 1 && (
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  Showing {((currentPage - 1) * topicsData.pagination.limit) + 1} to {Math.min(currentPage * topicsData.pagination.limit, topicsData.pagination.total)} of {topicsData.pagination.total} topics
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                      className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''} ${typeof page !== 'number' ? styles.ellipsis : ''}`}
                      disabled={typeof page !== 'number'}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === topicsData.pagination.pages}
                    className={styles.pageButton}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}