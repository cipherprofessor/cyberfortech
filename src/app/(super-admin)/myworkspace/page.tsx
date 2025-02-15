'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

import styles from './page.module.scss';
import { Sidebar } from './components/Sidebar/Sidebar';
import KPICard from './components/ui/Card/KPICard';
import { courseCategories, mockStats } from './components/lib/mockData';
import ListCourseCard from './components/ui/ListCard/ListCard';
import ListCardContainer from './components/ui/ListCard/ListCardContainer';

export default function MyWorkspacePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <Sidebar />

      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>Welcome to MyWorkspace</h1>
            {/* <p className={styles.subtitle}>
              Monitor your key performance indicators and platform metrics
            </p> */}
          </motion.div>

          <motion.div 
            className={styles.dateSelector}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <select className={styles.select}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </motion.div>
        </div>

        <motion.div 
  className={styles.statsGrid}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, staggerChildren: 0.1 }}
>
  {mockStats.map((stat, index) => (
    <motion.div
      key={stat.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
       <KPICard
        title={stat.title}
        value={stat.value}
        change={stat.change}
        icon={stat.icon}
        iconType={stat.iconType}
        className={styles.card}
      />
    </motion.div>
  ))}
</motion.div>

        {/* <div className={styles.additionalContent}>

        <div className=""> */}
        <ListCardContainer categories={courseCategories} />
      {/* {courseCategories.map(category => (
        <ListCardContainer key={category.id} categories={courseCategories} />
      ))} */}
    {/* </div>
        </div> */}
      </main>
    </div>
  );
}