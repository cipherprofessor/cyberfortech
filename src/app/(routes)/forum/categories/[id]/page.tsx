'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Loader, 
  MessageSquare, 
  Users, 
  Calendar,
  PlusCircle,
  Hash,
  LayoutGrid
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import styles from './category.module.scss';
import { CategoryInfo } from '@/components/Forum/CategoryInfo/CategoryInfo';
import { SubCategoriesList } from '@/components/Forum/SubCategoriesList/SubCategoriesList';
import { TopicsList } from '@/components/Topic/TopicsList/TopicsList';
import { NewTopicForm } from '@/components/ForumCategories/NewTopicForm/NewTopicForm';
import { 
  Topic, 
  Category, 
  CategoryStats, 
  SubCategory, 
  ApiTopic 
} from '@/types/forum';
import { Button } from '@heroui/button';

export default function CategoryPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Transform functions
  const transformTopics = (apiTopics: ApiTopic[]): Topic[] => {
    return apiTopics
      .filter(topic => topic.category_id.toString() === categoryId)
      .map(topic => ({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        category: topic.category_name,
        categoryId: topic.category_id,
        author: {
          id: topic.author_id,
          name: topic.author_name,
          avatar: topic.author_avatar,
          reputation: topic.author_reputation,
          badge: topic.author_badge
        },
        timestamp: topic.created_at,
        replies: topic.reply_count,
        views: topic.views,
        lastReply: {
          author: topic.last_reply_author || 'No replies yet',
          timestamp: topic.last_reply_date || topic.created_at
        },
        isPinned: topic.is_pinned,
        isLocked: topic.is_locked
      }));
  };

  // Single useEffect for all data fetching
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [categoryRes, statsRes, subCatRes, topicsRes] = await Promise.all([
          axios.get(`/api/forum/categories/${categoryId}`),
          axios.get(`/api/forum/categories/${categoryId}/stats`),
          axios.get(`/api/forum/categories/${categoryId}/subcategories`),
          axios.get(`/api/forum/topics?categoryId=${categoryId}`)
        ]);

        const transformedSubCategories = subCatRes.data.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          description: sub.description || '',
          topicCount: sub.topic_count
        }));

        setCategory(categoryRes.data);
        setStats(statsRes.data);
        setSubCategories(transformedSubCategories);
        setTopics(transformTopics(topicsRes.data.topics));
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]); // Only re-run when categoryId changes

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.loadingContent}
        >
          <Loader className={styles.spinner} />
          <span>Loading category...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className={styles.errorContainer}>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error || 'Category not found'}
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.categoryContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Category Info */}
      <motion.div 
        className={styles.categoryHeader}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.categoryInfo}>
            <div className={styles.categoryIcon}>
              {category.icon || <Hash />}
            </div>
            <div>
              <h1>{category.name}</h1>
              <p>{category.description}</p>
            </div>
          </div>

          {isAuthenticated && (
            <Button 
              onClick={() => setIsNewTopicOpen(true)}
              className={styles.newTopicButton}
            >
              <PlusCircle size={16} />
              New Topic
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className={styles.statsGrid}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.statCard}>
          <MessageSquare className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats?.total_topics || 0}</span>
            <span className={styles.statLabel}>Total Topics</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <Calendar className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats?.topics_today || 0}</span>
            <span className={styles.statLabel}>Today's Posts</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <Users className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats?.active_posters || 0}</span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <Users className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats?.active_posters || 0}</span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <Users className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats?.active_posters || 0}</span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
        </div>

      </motion.div>

      {/* Sub-Categories Section */}
      {subCategories.length > 0 && (
        <motion.div 
          className={styles.subCategoriesSection}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.sectionHeader}>
            <LayoutGrid size={20} />
            <h2>Sub-Categories</h2>
          </div>
          <SubCategoriesList subCategories={subCategories} />
        </motion.div>
      )}

      {/* Topics List */}
      <motion.div 
        className={styles.topicsSection}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.sectionHeader}>
          <MessageSquare size={20} />
          <h2>Topics About</h2>
        </div>
        <TopicsList 
          topics={topics}
          categoryId={categoryId}
          loading={loading}
        />
      </motion.div>

      <NewTopicForm 
        isOpen={isNewTopicOpen}
        onClose={() => setIsNewTopicOpen(false)}
        categories={[category]}
      />
    </motion.div>
  );
}