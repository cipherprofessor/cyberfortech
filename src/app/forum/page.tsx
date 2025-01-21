// src/app/forum/page.tsx
import { ForumCategories } from '@/components/forum/ForumCategories';
import { TopicsList } from '@/components/forum/TopicsList';
import { ForumStats } from '@/components/forum/ForumStats';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import styles from './forum.module.scss';

export default function ForumPage() {
  const forumStats = {
    totalTopics: 1250,
    totalPosts: 5680,
    activeUsers: 320,
    latestMember: 'johndoe',
  };

  const categories = [
    {
      id: 1,
      name: 'Network Security',
      description: 'Discuss network security concepts and best practices',
      totalTopics: 156,
      totalPosts: 892,
      icon: '🔒',
      subCategories: [
        { id: 11, name: 'Firewall Configuration' },
        { id: 12, name: 'VPN Setup' },
        { id: 13, name: 'Network Monitoring' },
      ],
    },
    {
      id: 2,
      name: 'Web Application Security',
      description: 'Topics related to securing web applications',
      totalTopics: 243,
      totalPosts: 1205,
      icon: '🌐',
      subCategories: [
        { id: 21, name: 'XSS Prevention' },
        { id: 22, name: 'SQL Injection' },
        { id: 23, name: 'CSRF Protection' },
      ],
    },
    {
      id: 3,
      name: 'Malware Analysis',
      description: 'Analyze and discuss various types of malware',
      totalTopics: 178,
      totalPosts: 876,
      icon: '🦠',
      subCategories: [
        { id: 31, name: 'Reverse Engineering' },
        { id: 32, name: 'Sandbox Analysis' },
        { id: 33, name: 'Threat Detection' },
      ],
    },
  ];

  const recentTopics = [
    {
      id: 1,
      title: 'Best practices for implementing zero trust architecture',
      category: 'Network Security',
      author: {
        name: 'Alice Johnson',
        avatar: '/avatars/alice.jpg',
        reputation: 1250,
        badge: 'Expert',
      },
      replies: 23,
      views: 156,
      lastReply: {
        author: 'Bob Smith',
        timestamp: '2024-01-21T15:30:00Z',
      },
      isPinned: true,
      isLocked: false,
      timestamp: '2024-01-20T10:00:00Z',
    },
    // Add more topics...
  ];

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
          <Button className={styles.newTopicButton}>
            <PlusCircle className={styles.buttonIcon} />
            New Topic
          </Button>
        </div>
      </div>

      <div className={styles.forumContent}>
        <div className={styles.mainSection}>
          <ForumCategories categories={categories} />
          <TopicsList topics={recentTopics} />
        </div>

        <aside className={styles.sideSection}>
          <ForumStats stats={forumStats} />
        </aside>
      </div>
    </div>
  );
}