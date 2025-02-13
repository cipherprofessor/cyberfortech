// components/SuperAdminCourseDashboard/SuperAdminCourseDashboard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DonutChart } from '@/components/charts/Re-charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/Re-charts/composite/AnalyticsDashboardChart';
import {
  IconUsers,
  IconClock,
  IconTrophy,
  IconCertificate,
  IconMoneybag,
  IconCode,
  IconDatabase,
  IconDeviceMobile,
  IconPalette,
} from '@tabler/icons-react';
import styles from './SuperAdminCourseDashboard.module.scss';

export interface Course11 {
  id: string;
  title: string;
  description: string;
  instructor: string;
  createdBy: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  enrollments: number;
  completionRate: number;
  averageRating: number;
  totalWatchTime: number;
  revenue: number;
  status: 'draft' | 'published' | 'archived';
  lastUpdated: string;
  thumbnail: string;
  sections: number;
  lessons: number;
}

interface SuperAdminCourseDashboardProps {
  courses: Course11[];
}

const SuperAdminCourseDashboard: React.FC<SuperAdminCourseDashboardProps> = ({ courses }) => {
  const analytics = {
    totalEnrollments: courses.reduce((acc, course) => acc + course.enrollments, 0),
    totalCompletions: courses.reduce((acc, course) => 
      acc + Math.floor(course.enrollments * (course.completionRate / 100)), 0),
    averageWatchTime: courses.reduce((acc, course) => acc + course.totalWatchTime, 0) / courses.length,
    totalRevenue: courses.reduce((acc, course) => acc + course.revenue, 0),
    popularCategories: [
      { category: 'Web Development', count: 4050 },
      { category: 'Data Science', count: 300 },
      { category: 'Mobile Development', count: 3200 },
      { category: 'UI/UX Design', count: 280 },
      { category: 'App Development', count: 4050 },
      { category: 'Data Engineering', count: 800 },
      { category: 'IOS Development', count: 3200 },
      { category: 'Cyber Security', count: 2080 }
    ],
  };

  const courseProgressData = courses.map(course => ({
    name: course.title.substring(0, 20) + (course.title.length > 20 ? '...' : ''),
    enrollments: course.enrollments,
    completions: Math.floor(course.enrollments * (course.completionRate / 100)),
    revenue: course.revenue,
    watchTime: course.totalWatchTime / 60
  }));

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
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const statCards = [
    {
      title: 'Total Enrollments',
      value: analytics.totalEnrollments.toLocaleString(),
      icon: <IconUsers className={styles.icon} />,
      change: '+12.5%',
      variant: 'blue'
    },
    {
      title: 'Course Completions',
      value: analytics.totalCompletions.toLocaleString(),
      icon: <IconCertificate className={styles.icon} />,
      change: '+8.2%',
      variant: 'green'
    },
    {
      title: 'Avg. Watch Time',
      value: `${Math.floor(analytics.averageWatchTime / 60)}h`,
      icon: <IconClock className={styles.icon} />,
      change: '+15.3%',
      variant: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: <IconMoneybag className={styles.icon} />,
      change: '+10.8%',
      variant: 'gold'
    }
  ];

  return (
    <motion.div 
      className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl dark:shadow-gray-800/30"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className={`p-4 rounded-full ${
                stat.variant === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                stat.variant === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                stat.variant === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Course Performance
          </h3>
          <EnhancedAnalyticsDashboardChart
            data={courseProgressData}
            series={[
              {
                type: 'bar',
                dataKey: 'enrollments',
                name: 'Enrollments',
                color: '#3B82F6'
              },
              {
                type: 'line',
                dataKey: 'completions',
                name: 'Completions',
                color: '#10B981'
              },
              {
                type: 'line',
                dataKey: 'revenue',
                name: 'Revenue',
                color: '#F59E0B',
                yAxisId: '2'
              }
            ]}
            xAxisKey="name"
            height={300}
            title="Course Performance Overview"
            subtitle="Track enrollments, completions, and revenue"
          />
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Popular Categories
          </h3>
          <div className="h-[400px] w-[700px]">
            <DonutChart
              data={analytics.popularCategories.map((cat, index) => ({
                name: cat.category,
                value: cat.count,
                // icon: cat.icon,
                color: [
                  '#3B82F6', // blue
                  '#10B981', // green
                  '#F59E0B', // orange
                  '#8B5CF6',  // purple
                  // '#3B83F6', // blue
                  // '#10B781', // green
                  // '#F59G0B', // orange
                  // '#FFFFFF'  // purple

                ][index % 4]
              }))}
              height={450}
              innerRadius={70}
              outerRadius={90}
              centerText={{
                primary: analytics.popularCategories
                  .reduce((acc, cat) => acc + cat.count, 0)
                  .toString(),
                secondary: 'Total Courses'
              }}
              showLabels={true}
              showTooltip={true}
              showLegend={true}
              interactive={true}
              animate={true}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuperAdminCourseDashboard;