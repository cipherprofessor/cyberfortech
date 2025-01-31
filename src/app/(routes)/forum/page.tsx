// src/app/(routes)/forum/page.tsx
"use client"
import { PlusCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './forum.module.scss';
import { ForumCategories } from '@/components/ForumCategories/ForumCategories';
import { Button } from '@heroui/react';
import { ForumStats } from '@/components/ForumCategories/ForumStats/ForumStats';
import { TopicsList } from '@/components/Topic/TopicsList/TopicsList';
import { NewTopicForm } from '@/components/Topic/NewTopicForm/NewTopicForm';

export default function ForumPage() {
  const [categories, setCategories] = useState([]);
  const [forumStats, setForumStats] = useState({
    totalTopics: 0,
    totalPosts: 0,
    activeUsers: 0,
    latestMember: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const [categoriesRes, statsRes] = await Promise.all([
          axios.get('/api/forum/categories'),
          axios.get('/api/forum/stats')
        ]);

        setCategories(categoriesRes.data);
        setForumStats(statsRes.data);
      } catch (err) {
        setError('Failed to load forum data');
        console.error('Error fetching forum data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForumData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading forum data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.forumContainer}>
      <div className={styles.forumHeader}>
        <div className={styles.titleSection}>
          <h1>Community Forum</h1>
          <p>Join discussions about cybersecurity and technology</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search forum..."
              className={styles.searchInput}
            />
          </div>
          <Button
  variant="solid"
  onPress={() => setIsNewTopicOpen(true)}
>
  <PlusCircle className="w-5 h-5" />
  New Topic
</Button>

<NewTopicForm 
  isOpen={isNewTopicOpen} 
  onClose={() => setIsNewTopicOpen(false)} 
/>
        </div>
      </div>

      <div className={styles.forumContent}>
        <div className={styles.mainSection}>
          <ForumCategories categories={categories} />
          <TopicsList topics={[]} /> {/* You'll need to implement the topics API as well */}
        </div>

        <aside className={styles.sideSection}>
          <ForumStats/>
        </aside>
      </div>
    </div>
  );
}