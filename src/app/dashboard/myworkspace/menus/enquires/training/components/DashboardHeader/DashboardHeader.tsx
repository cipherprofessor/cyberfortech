// src/app/dashboard/myworkspace/menus/enquires/training/components/DashboardHeader/DashboardHeader.tsx
"use client"
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, DollarSign, Calendar, Award } from 'lucide-react';
import styles from './DashboardHeader.module.scss';

interface DashboardHeaderProps {
  stats: {
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    revenueGrowth: number;
    enrollmentRate: number;
    popularCategory: string;
  };
}

export default function DashboardHeader({ stats }: DashboardHeaderProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitle}>
        <h1>Training Management Dashboard</h1>
        <p>Manage courses, enrollments, and analyze performance metrics</p>
      </div>

      <motion.div 
        className={styles.statsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Courses */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.iconContainer}>
            <Calendar size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </motion.div>

        {/* Total Enrollments */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.iconContainer}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.totalEnrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </motion.div>

        {/* Total Revenue */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.iconContainer}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </motion.div>

        {/* Revenue Growth */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.iconContainer}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={stats.revenueGrowth >= 0 ? styles.positive : styles.negative}>
              {stats.revenueGrowth > 0 && '+'}
              {stats.revenueGrowth}%
            </h3>
            <p>Monthly Growth</p>
          </div>
        </motion.div>

        {/* Enrollment Rate */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.iconContainer}>
            <BarChart2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.enrollmentRate}%</h3>
            <p>Enrollment Rate</p>
          </div>
        </motion.div>

        {/* Popular Category */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.iconContainer}>
            <Award size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.popularCategory || 'N/A'}</h3>
            <p>Popular Category</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}