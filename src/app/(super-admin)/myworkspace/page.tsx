'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

import styles from './page.module.scss';
import { Sidebar } from './components/Sidebar/Sidebar';
import KPICard from './components/ui/Card/KPICard';
import { mockStats } from './components/lib/mockData';

interface Stat {
  id: number;
  title: string;
  value: string;
  change: number;
  icon: 'users' | 'revenue' | 'orders' | 'activity';
}

const stats: Stat[] = [
  {
    id: 1,
    title: 'Total Users',
    value: '12,345',
    change: 12.5,
    icon: 'users'
  },
  {
    id: 2,
    title: 'Revenue',
    value: '$45,678',
    change: -2.3,
    icon: 'revenue'
  },
  {
    id: 3,
    title: 'Total Orders',
    value: '1,234',
    change: 8.1,
    icon: 'orders'
  },
  {
    id: 4,
    title: 'Active Sessions',
    value: '892',
    change: 3.2,
    icon: 'activity'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

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
          className={styles.statsGrid}>
          {mockStats.map((stat) => (
            <KPICard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </motion.div>

        <div className={styles.additionalContent}>
          {/* Placeholder for charts or additional content */}
          <motion.div 
            className={styles.chartSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className={styles.sectionTitle}>Performance Overview</h2>
            <div className={styles.chartPlaceholder}>
              {/* Add your charts or additional content here */}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}