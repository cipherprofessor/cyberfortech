'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Layout,
  MessageSquare,
  Users,
  Calendar,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export function ForumManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteType, setConfirmDeleteType] = useState<'category' | 'topic'>('category');
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
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
      setToast({ type: 'success', message: 'Category created successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create category';
      throw new Error(errorMessage);
    }
  };

  const handleEditCategory = async (formData: any) => {
    if (!editingCategory) return;
    
    try {
      const response = await axios.put(`/api/forum/categories/${editingCategory.id}`, formData);
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...response.data, subCategories: cat.subCategories } : cat
      ));
      setEditingCategory(null);
      setToast({ type: 'success', message: 'Category updated successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update category';
      throw new Error(errorMessage);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setItemToDelete(categoryId);
    setConfirmDeleteType('category');
    setConfirmDelete(true);
  };

  const handleDeleteTopic = async (topicId: number) => {
    setItemToDelete(topicId);
    setConfirmDeleteType('topic');
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDeleteType === 'category' && typeof itemToDelete === 'string') {
        await axios.delete(`/api/forum/categories?id=${itemToDelete}`);
        setCategories(categories.filter(cat => cat.id !== itemToDelete));
        setToast({ type: 'success', message: 'Category deleted successfully' });
      } else if (confirmDeleteType === 'topic' && typeof itemToDelete === 'number') {
        await axios.delete(`/api/forum/topics?id=${itemToDelete}`);
        setTopicsData(prev => ({
          ...prev,
          topics: prev.topics.filter(topic => topic.id !== itemToDelete)
        }));
        setToast({ type: 'success', message: 'Topic deleted successfully' });
      }
    } catch (err: any) {
      console.error('Delete error:', err.response?.data || err.message);
      setToast({ 
        type: 'error', 
        message: err.response?.data?.error || `Failed to delete ${confirmDeleteType}`
      });
    } finally {
      setConfirmDelete(false);
      setItemToDelete(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <motion.div 
          className={styles.loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className={styles.spinner} />
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!isAdmin && !isStudent) {
    return (
      <motion.div 
        className={styles.accessDenied}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Access denied
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.pageHeader}>
        <motion.h1 
          className={styles.title}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          Forum Management
        </motion.h1>
        <motion.div 
          className={styles.headerStats}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
        >
          <div className={styles.statItem}>
            <Layout size={20} />
            <span>{categories.length} Categories</span>
          </div>
          <div className={styles.statItem}>
            <MessageSquare size={20} />
            <span>{topicsData.pagination.total} Topics</span>
          </div>
        </motion.div>
      </div>
      
      {error && (
        <motion.div 
          className={styles.error}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      {/* Categories Section */}
      <motion.section 
        className={styles.section}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.sectionHeader}>
          <h2>Categories</h2>
          <motion.button 
            className={styles.addButton}
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            Add Category
          </motion.button>
        </div>

        <AnimatePresence>
          {isAddingCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryForm
                onSubmit={handleAddCategory}
                onCancel={() => setIsAddingCategory(false)}
              />
            </motion.div>
          )}

          {editingCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryForm
                initialData={editingCategory}
                onSubmit={handleEditCategory}
                onCancel={() => setEditingCategory(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.categoriesList}>
          {categories.map((category, index) => (
            <motion.div 
              key={category.id} 
              className={styles.categoryItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div 
                className={styles.categoryHeader}
                onClick={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
              >
                <div className={styles.categoryTitle}>
                  {category.icon && (
                    <span 
                      className={styles.icon}
                      style={{ color: category.color }}
                    >
                      {category.icon}
                    </span>
                  )}
                  <h3>{category.name}</h3>
                  {!category.is_active && (
                    <span className={styles.inactiveLabel}>Inactive</span>
                  )}
                </div>
                <div className={styles.categoryStats}>
                  <span>
                    <MessageSquare size={14} />
                    {category.total_topics} topics
                  </span>
                  <span>
                    <Users size={14} />
                    {category.total_posts} posts
                  </span>
                  {category.last_post_at && (
                    <span>
                      <Calendar size={14} />
                      {new Date(category.last_post_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className={styles.categoryActions}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={styles.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category);
                    }}
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                  <motion.button 
                    className={styles.expandButton}
                    animate={{ 
                      rotate: expandedCategory === category.id ? 180 : 0 
                    }}
                  >
                    <ChevronDown size={16} />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {expandedCategory === category.id && (
                  <motion.div 
                    className={styles.categoryDetails}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                            <motion.li 
                              key={sub.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {sub.name}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Topics Section */}
      <motion.section 
        className={styles.section}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.sectionHeader}>
          <h2>Recent Topics</h2>
        </div>

        <div className={styles.tableWrapper}>
          <ForumRecentTopicTable
            topics={topicsData.topics}
            onDelete={handleDeleteTopic}
            loading={isLoadingTopics}
            pagination={topicsData.pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Pagination */}
        {topicsData.pagination.pages > 1 && (
          <motion.div 
            className={styles.pagination}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoadingTopics}
            >
              Previous
            </button>

            <div className={styles.paginationNumbers}>
              {Array.from({ length: topicsData.pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoadingTopics}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === topicsData.pagination.pages || isLoadingTopics}
            >
              Next
            </button>
          </motion.div>
        )}
      </motion.section>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <div className={styles.modalHeader}>
                <h3>Confirm Delete</h3>
                <button 
                  onClick={() => setConfirmDelete(false)}
                  className={styles.modalClose}
                >
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalContent}>
                <p>Are you sure you want to delete this {confirmDeleteType}? This action cannot be undone.</p>
              </div>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className={styles.modalCancel}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className={styles.modalDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success/Error Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${styles[toast.type]}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className={styles.toastClose}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}