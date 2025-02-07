// src/app/(routes)/forum/categories/[id]/page.tsx
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
  LayoutGrid,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import styles from './category.module.scss';
import { TopicsList } from '@/components/Topic/TopicsList/TopicsList';
import { NewTopicForm } from '@/components/ForumCategories/NewTopicForm/NewTopicForm';
import { SubCategoriesList } from '@/components/Forum/SubCategoriesList/SubCategoriesList';
import { 
  Topic, 
  Category, 
  CategoryStats, 
  SubCategory, 
  ApiTopic 
} from '@/types/forum';
import { Button } from '@heroui/button';

const CategorySkeleton = () => (
  <div className={styles.skeletonContainer}>
    {/* Header Skeleton */}
    <div className={styles.headerSkeleton}>
      <div className={styles.iconSkeleton} />
      <div className={styles.contentSkeleton}>
        <div className={styles.titleSkeleton} />
        <div className={styles.descriptionSkeleton} />
      </div>
    </div>
    
    {/* Stats Grid Skeleton */}
    <div className={styles.statsGridSkeleton}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={styles.statCardSkeleton}>
          <div className={styles.statIconSkeleton} />
          <div className={styles.statContentSkeleton}>
            <div className={styles.statValueSkeleton} />
            <div className={styles.statLabelSkeleton} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

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

  // Fetch all data
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

        console.log('Topics API Response:', topicsRes.data); // Debug log

        // Transform subcategories
        const transformedSubCategories = subCatRes.data.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          description: sub.description || '',
          topicCount: sub.topic_count
        }));

        // Set the topics directly from the API response
        const transformedTopics = topicsRes.data.topics.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author_id: topic.author_id,
          author_name: topic.author_name,
          author_image: topic.author_image,
          author_email: topic.author_email,
          category_id: topic.category_id,
          category_name: topic.category_name,
          subcategory_id: topic.subcategory_id,
          subcategory_name: topic.subcategory_name,
          is_pinned: Boolean(topic.is_pinned),
          is_locked: Boolean(topic.is_locked),
          views: Number(topic.views) || 0,
          reply_count: Number(topic.reply_count) || 0,
          created_at: topic.created_at,
          updated_at: topic.updated_at
        }));

        setCategory(categoryRes.data.category);
        setStats(statsRes.data);
        setSubCategories(transformedSubCategories);
        setTopics(transformedTopics);

        console.log('Transformed topics:', transformedTopics); // Debug log
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  return (
    <div className={styles.categoryContainer}>
      <AnimatePresence mode="wait">
        {loading ? (
          <CategorySkeleton />
        ) : (
          <>
             {/* Header Section */}
             <motion.div 
              className={styles.categoryHeader}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.headerContent}>
                <div className={styles.categoryInfo}>
                  <div className={styles.categoryIcon}>
                    {category?.icon || <Hash />}
                  </div>
                  <div>
                    <h1>{category?.name}</h1>
                    <p>{category?.description}</p>
                  </div>
                </div>

                {isAuthenticated && (
                  <Button 
                    onClick={() => setIsNewTopicOpen(true)}
                    className={styles.newTopicButton}
                  >
                    <PlusCircle size={16} />
                    Start New Topic
                  </Button>
                )}
              </div>
            </motion.div>


            {/* Stats Grid */}
            <motion.div 
              className={styles.statsGrid}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
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
                  <span className={styles.statValue}>{stats?.posts_today || 0}</span>
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
                <Clock className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.avg_response_time || '0m'}</span>
                  <span className={styles.statLabel}>Avg. Response</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <Zap className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.engagement_rate || '0%'}</span>
                  <span className={styles.statLabel}>Engagement</span>
                </div>
              </div>
            </motion.div>

            {/* Sub-Categories Section */}
            {subCategories.length > 0 && (
              <motion.div 
                className={styles.subCategoriesSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className={styles.sectionHeader}>
                  <LayoutGrid size={20} />
                  <h2>Sub-Categories</h2>
                </div>
                <SubCategoriesList subCategories={subCategories} />
              </motion.div>
            )}

            {/* Topics Section */}
            <motion.div 
              className={styles.topicsSection}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {error ? (
                <div className={styles.error}>{error}</div>
              ) : (
                <TopicsList 
                  topics={topics}
                  categoryId={categoryId}
                  categoryName={category?.name}
                  loading={loading}
                />
              )}
            </motion.div>

            <NewTopicForm 
              isOpen={isNewTopicOpen}
              onClose={() => setIsNewTopicOpen(false)}
              categories={category ? [category] : []}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}