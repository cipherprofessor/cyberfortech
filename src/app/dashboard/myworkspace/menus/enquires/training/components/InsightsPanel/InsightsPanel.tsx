"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import styles from './InsightsPanel.module.scss';

// This would be a real API call in production
const fetchTrainingStats = async () => {
  // Simulated API response
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        // Overall stats
        totalCourses: 12,
        totalEnrollments: 156,
        totalRevenue: 89500,
        
        // Monthly stats (for charts)
        monthlyEnrollments: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 15 },
          { month: 'Mar', count: 22 },
          { month: 'Apr', count: 18 },
          { month: 'May', count: 25 },
          { month: 'Jun', count: 32 },
        ],
        
        monthlyRevenue: [
          { month: 'Jan', amount: 7200 },
          { month: 'Feb', amount: 9000 },
          { month: 'Mar', amount: 13200 },
          { month: 'Apr', amount: 10800 },
          { month: 'May', amount: 15000 },
          { month: 'Jun', amount: 19200 },
        ],
        
        // Category breakdown
        categoryEnrollments: [
          { category: 'Security', count: 58 },
          { category: 'Cloud', count: 42 },
          { category: 'Development', count: 34 },
          { category: 'Blockchain', count: 22 },
        ],
        
        // Course popularity
        popularCourses: [
          { id: 'course-001', title: 'Cybersecurity Fundamentals', enrollments: 28 },
          { id: 'course-002', title: 'Advanced Penetration Testing', enrollments: 22 },
          { id: 'course-003', title: 'Cloud Security Architecture', enrollments: 19 },
          { id: 'course-004', title: 'Secure Coding Practices', enrollments: 17 },
          { id: 'course-005', title: 'Incident Response and Forensics', enrollments: 15 },
        ],
        
        // Monthly growth rate
        monthlyGrowthRate: 12.5
      });
    }, 1500);
  });
};

export default function InsightsPanel() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchTrainingStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch statistics. Please try again.');
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate maximum value for chart scaling
  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key])) * 1.2; // Add 20% padding
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

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={36} className={styles.loadingSpinner} />
        <p>Loading insights...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={36} className={styles.errorIcon} />
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.insightsContainer}>
      <div className={styles.insightsHeader}>
        <h2>Training Insights</h2>
        <p>Analytics and performance metrics for your training courses</p>
      </div>
      
      <motion.div 
        className={styles.statsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Courses */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIcon}>
            <Calendar size={20} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </motion.div>
        
        {/* Total Enrollments */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIcon}>
            <Users size={20} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.totalEnrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </motion.div>
        
        {/* Total Revenue */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIcon}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statInfo}>
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </motion.div>
        
        {/* Monthly Growth */}
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIcon}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.positive}>+{stats.monthlyGrowthRate}%</h3>
            <p>Monthly Growth</p>
          </div>
        </motion.div>
      </motion.div>
      
      <div className={styles.chartsGrid}>
        {/* Monthly Enrollments Chart */}
        <motion.div 
          className={styles.chartCard}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className={styles.chartTitle}>
            <Users size={16} />
            Monthly Enrollments
          </h3>
          
          <div className={styles.barChart}>
            {stats.monthlyEnrollments.map((item: any, index: number) => (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barLabel}>{item.month}</div>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar}
                    style={{ 
                      height: `${(item.count / getMaxValue(stats.monthlyEnrollments, 'count')) * 100}%` 
                    }}
                  >
                    <span className={styles.barValue}>{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Monthly Revenue Chart */}
        <motion.div 
          className={styles.chartCard}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className={styles.chartTitle}>
            <DollarSign size={16} />
            Monthly Revenue
          </h3>
          
          <div className={styles.barChart}>
            {stats.monthlyRevenue.map((item: any, index: number) => (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barLabel}>{item.month}</div>
                <div className={styles.barContainer}>
                  <div 
                    className={`${styles.bar} ${styles.revenueBar}`}
                    style={{ 
                      height: `${(item.amount / getMaxValue(stats.monthlyRevenue, 'amount')) * 100}%` 
                    }}
                  >
                    <span className={styles.barValue}>{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className={styles.insightsGrid}>
        {/* Category Enrollments */}
        <motion.div 
          className={styles.insightCard}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className={styles.insightTitle}>Category Breakdown</h3>
          
          <div className={styles.categoryList}>
            {stats.categoryEnrollments.map((item: any, index: number) => (
              <div key={index} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{item.category}</span>
                  <span className={styles.categoryCount}>{item.count} enrollments</span>
                </div>
                <div className={styles.categoryBarContainer}>
                  <div 
                    className={styles.categoryBar}
                    style={{ 
                      width: `${(item.count / stats.totalEnrollments) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Popular Courses */}
        <motion.div 
          className={styles.insightCard}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className={styles.insightTitle}>Popular Courses</h3>
          
          <div className={styles.popularList}>
            {stats.popularCourses.map((course: any, index: number) => (
              <div key={course.id} className={styles.popularItem}>
                <div className={styles.popularRank}>{index + 1}</div>
                <div className={styles.popularInfo}>
                  <div className={styles.popularTitle}>{course.title}</div>
                  <div className={styles.popularEnrollments}>
                    <Users size={14} />
                    <span>{course.enrollments} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}