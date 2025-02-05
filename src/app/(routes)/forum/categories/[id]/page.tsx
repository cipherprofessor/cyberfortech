// src/app/(routes)/forum/categories/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { 
  Loader, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

import { useAuth } from '@/hooks/useAuth';
import styles from './category.module.scss';
import { CategoryInfo } from '@/components/Forum/CategoryInfo/CategoryInfo';
import { SubCategoriesList } from '@/components/Forum/SubCategoriesList/SubCategoriesList';
import { TopicsList } from '@/components/Topic/TopicsList/TopicsList';

interface CategoryStats {
  totalTopics: number;
  todaysPosts: number;
  activeUsers: number;
  lastPost: {
    title: string;
    author: string;
    date: string;
  };
}

interface CategoryData {
  id: number;
  name: string;
  description: string;
  icon: string;
  rules?: string[];
  moderators?: string[];
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
  topicCount: number;
}

export default function CategoryPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState({
    category: true,
    stats: true,
    subCategories: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`/api/forum/categories/${categoryId}`);
        setCategory(response.data);
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
          const [statsRes, subCatRes] = await Promise.all([
            axios.get(`/api/forum/categories/${categoryId}/stats`),
            axios.get(`/api/forum/categories/${categoryId}/subcategories`)
          ]);

          setStats(statsRes.data);
          setSubCategories(subCatRes.data);
        } catch (err) {
          console.error('Error fetching category details:', err);
        } finally {
          setLoading(prev => ({
            ...prev,
            stats: false,
            subCategories: false
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
      {/* Category Header */}
      <div className={styles.categoryHeader}>
        <CategoryInfo category={category} />
        
        {isAuthenticated && (
          <Button 
            className={styles.newTopicButton}
            onClick={() => {/* Handle new topic */}}
          >
            New Topic in {category.name}
          </Button>
        )}
      </div>

      {/* Category Stats */}
      {!loading.stats && stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <MessageSquare className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalTopics}</span>
              <span className={styles.statLabel}>Total Topics</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <Calendar className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.todaysPosts}</span>
              <span className={styles.statLabel}>Today's Posts</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <Users className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.activeUsers}</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Categories */}
      {!loading.subCategories && subCategories.length > 0 && (
        <div className={styles.subCategoriesSection}>
          <h2>Sub-Categories</h2>
          <SubCategoriesList subCategories={subCategories} />
        </div>
      )}

      {/* Topics List */}
      <div className={styles.topicsSection}>
        <h2>Topics in {category.name}</h2>
        <TopicsList categoryId={categoryId} topics={[]} />
      </div>
    </div>
  );
}