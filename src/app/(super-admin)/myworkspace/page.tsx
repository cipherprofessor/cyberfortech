'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { ViewIcon } from 'lucide-react';

import styles from './page.module.scss';
import { Sidebar } from './components/Sidebar/Sidebar';
import KPICard from './components/ui/Card/KPICard';
import { courseCategories, mockStats } from './components/lib/mockData';
import ListCardContainer from './components/ui/ListCard/ListCardContainer';
import ApacheRadarChart from '@/components/charts/Apache-ECharts/ApacheRadarChart/ApacheRadarChart';
import ApacheAreaChart from '@/components/charts/Apache-ECharts/ApacheAreaChart/ApacheAreaChart';

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
  
        <div className={styles.bentoGrid}>
          {/* Stats Section */}
          <motion.div 
            className={`${styles.bentoItem} ${styles.stats}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.statsGrid}>
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
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
  
          {/* Radar Chart */}
          <motion.div 
            className={`${styles.bentoItem} ${styles.radar}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ApacheRadarChart />
          </motion.div>

          <motion.div
          className={`${styles.bentoItem} ${styles.apacheAreaChart}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

          <ApacheAreaChart />

          </motion.div>
  
          {/* Categories */}
          <motion.div 
            className={`${styles.bentoItem} ${styles.categoriesList}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ListCardContainer 
              categories={courseCategories} 
              title="Course Categories"
              button={<ViewIcon />}
              onButtonClick={() => console.log('View all clicked')}
            />
          </motion.div>


          {/* <motion.div 
            className={`${styles.bentoItem} ${styles.categories}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ListCardContainer 
              categories={courseCategories} 
              title="Course Categories"
              button={<ViewIcon />}
              onButtonClick={() => console.log('View all clicked')}
            />
          </motion.div> */}
  
          {/* Add more bento items here */}
        </div>
      </main>
    </div>
  );
}