'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import styles from './page.module.scss';
import { Sidebar } from '../../../components/Sidebar/Sidebar';


export default function AllCoursesPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid rendering on the server
  }

  const isDark = theme === 'dark';

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      {/* Include the Sidebar */}
      <Sidebar />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>All Courses</h1>
        <p className={styles.subtitle}>
          View and manage all courses in your workspace.
        </p>

        {/* Add your course list or table here */}
        <div className={styles.courseList}>
          {/* Example Course Card */}
          <div className={styles.courseCard}>
            <h2>Course Title 1</h2>
            <p>Description of Course 1</p>
          </div>
          <div className={styles.courseCard}>
            <h2>Course Title 2</h2>
            <p>Description of Course 2</p>
          </div>
        </div>
      </main>
    </div>
  );
}