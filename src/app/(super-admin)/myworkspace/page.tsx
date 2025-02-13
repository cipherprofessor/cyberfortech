'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import styles from './page.module.scss';
import { stats } from './components/lib/mockData';
import { Card } from './components/ui/Card/Card';
import { Sidebar } from './components/Sidebar/Sidebar';

export default function MyWorkspacePage() {
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
        <h1 className={styles.title}>Welcome to MyWorkspace</h1>
        <p className={styles.subtitle}>
          Manage your platform efficiently and effectively.
        </p>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>
      </main>
    </div>
  );
}