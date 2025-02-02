"use client"
import { PlusCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/nextjs';
import styles from './forum.module.scss';
import { ForumCategories } from '@/components/ForumCategories/ForumCategories';
import { Button } from '@heroui/react';
import { ForumStats } from '@/components/ForumCategories/ForumStats/ForumStats';

import { NewTopicForm } from '@/components/Topic/NewTopicForm/NewTopicForm';
import { ForumManagement } from '@/components/ForumCategories/ForumManagement/ForumManagement';

export default function ForumPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
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

  if (!isLoaded || loading) {
    return <div className={styles.loading}>Loading forum data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Check if user is admin or super_admin using Clerk metadata or publicMetadata
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                 user?.publicMetadata?.role === 'super_admin'||
                 user?.publicMetadata?.role === 'superadmin'
                 ;

  return (
    <div className={styles.forumContainer}>
      {/* Only show ForumManagement for admin users */}
      {isSignedIn && isAdmin && (
        <div className={styles.adminSection}>
          <ForumManagement />
        </div>
      )}

      {/* <div className={styles.forumHeader}>
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
          {isSignedIn && (
            <Button
              variant="solid"
              onPress={() => setIsNewTopicOpen(true)}
            >
              <PlusCircle className="w-5 h-5" />
              New Topic
            </Button>
          )}
        </div>
      </div> */}

      {/* {isNewTopicOpen && (
        <NewTopicForm 
          isOpen={isNewTopicOpen} 
          onClose={() => setIsNewTopicOpen(false)} 
        />
      )} */}

      {/* <div className={styles.forumContent}>
        <div className={styles.mainSection}>
          <ForumCategories categories={categories} />
         
        </div>

        <aside className={styles.sideSection}>
          <ForumStats/>
        </aside>
      </div> */}
    </div>
  );
}