"use client"
import { useState } from 'react';

import { useAuth, } from '@clerk/nextjs';
import styles from './forum.module.scss';

import { ForumManagement } from '@/components/ForumCategories/ForumManagement/ForumManagement';

export default function ForumPage() {
  const { isSignedIn} = useAuth();

  const [error, setError] = useState('');
  



  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.forumContainer}>
     
      {isSignedIn && (
        <div className={styles.adminSection}>
          <ForumManagement />

        </div>
      )}

    </div>
  );
}