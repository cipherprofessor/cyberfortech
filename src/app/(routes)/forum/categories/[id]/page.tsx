// src/app/(routes)/forum/categories/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { 
  Loader, 
  MessageSquare, 
  Users, 
  Calendar,
  PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
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

export default function CategoryPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [loading, setLoading] = useState({
    category: true,
    stats: true,
    subCategories: true,
    topics: true
  });
  const [error, setError] = useState('');

 // src/app/(routes)/forum/categories/[id]/page.tsx
const transformTopics = (apiTopics: ApiTopic[]): Topic[] => {
    return apiTopics.map(topic => ({
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

  const transformSubCategories = (apiSubCategories: any[]): SubCategory[] => {
    return apiSubCategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description || '',
      topicCount: sub.topic_count
    }));
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`/api/forum/categories/${categoryId}`);
        const categoryData = {
          ...response.data,
          subCategories: [] // Initialize empty array
        };
        setCategory(categoryData);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
      } finally {
        setLoading(prev => ({ ...prev, category: false }));
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  useEffect(() => {
    if (!loading.category && category) {
      const fetchCategoryDetails = async () => {
        try {
          const [statsRes, subCatRes, topicsRes] = await Promise.all([
            axios.get(`/api/forum/categories/${categoryId}/stats`),
            axios.get(`/api/forum/categories/${categoryId}/subcategories`),
            axios.get(`/api/forum/topics?categoryId=${categoryId}`)
          ]);

          setStats(statsRes.data);
          const transformedSubCategories = transformSubCategories(subCatRes.data);
          setSubCategories(transformedSubCategories);
          setCategory(prev => prev ? {
            ...prev,
            subCategories: transformedSubCategories
          } : null);
          setTopics(transformTopics(topicsRes.data.topics));
        } catch (err) {
          console.error('Error fetching category details:', err);
        } finally {
          setLoading(prev => ({
            ...prev,
            stats: false,
            subCategories: false,
            topics: false
          }));
        }
      };

      fetchCategoryDetails();
    }
  }, [categoryId, category, loading.category]);

  if (loading.category) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} />
        <span>Loading category...</span>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className={styles.errorContainer}>
        <p>{error || 'Category not found'}</p>
      </div>
    );
  }

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryHeader}>
        <CategoryInfo category={category} />
        
        {isAuthenticated && (
          <Button 
            className={styles.newTopicButton}
            onClick={() => setIsNewTopicOpen(true)}
          >
            <PlusCircle size={16} />
            New Topic in {category.name}
          </Button>
        )}
      </div>

      {!loading.stats && stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <MessageSquare className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total_topics}</span>
              <span className={styles.statLabel}>Total Topics</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <Calendar className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.posts_today}</span>
              <span className={styles.statLabel}>Today's Posts</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <Users className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.active_posters}</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
          </div>
        </div>
      )}

      {!loading.subCategories && subCategories.length > 0 && (
        <div className={styles.subCategoriesSection}>
          <h2>Sub-Categories</h2>
          <SubCategoriesList subCategories={subCategories} />
        </div>
      )}

      <div className={styles.topicsSection}>
        <h2>Topics in {category.name}</h2>
        <TopicsList 
          topics={topics}
          categoryId={categoryId}
          loading={loading.topics}
        />
      </div>

      <NewTopicForm 
        isOpen={isNewTopicOpen}
        onClose={() => setIsNewTopicOpen(false)}
        categories={[category]}
      />
    </div>
  );
}