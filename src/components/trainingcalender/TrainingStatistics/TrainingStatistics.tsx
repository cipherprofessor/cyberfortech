"use client"
import { motion } from 'framer-motion';
import { Users, Monitor, Zap, ChevronUp, BookOpen, BarChart3 } from 'lucide-react';
import styles from './TrainingStatistics.module.scss';

interface TrainingStatisticsProps {
  totalCourses: number;
  onlineCourses: number;
  hybridCourses: number;
  beginnerCourses: number;
  intermediateCourses: number;
  advancedCourses: number;
}

export function TrainingStatistics({
  totalCourses,
  onlineCourses,
  hybridCourses,
  beginnerCourses,
  intermediateCourses,
  advancedCourses
}: TrainingStatisticsProps) {
  // Calculate percentages for the charts
  const calculatePercentage = (value: number) => {
    return totalCourses > 0 ? Math.round((value / totalCourses) * 100) : 0;
  };

  const onlinePercentage = calculatePercentage(onlineCourses);
  const hybridPercentage = calculatePercentage(hybridCourses);
  const inPersonPercentage = 100 - onlinePercentage - hybridPercentage;

  const beginnerPercentage = calculatePercentage(beginnerCourses);
  const intermediatePercentage = calculatePercentage(intermediateCourses);
  const advancedPercentage = calculatePercentage(advancedCourses);

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
    <motion.div
      className={styles.statisticsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.statisticsHeader}>
        <h3 className={styles.statisticsTitle}>
          <BarChart3 size={18} />
          Training Statistics
        </h3>
      </div>

      <div className={styles.statisticsContent}>
        <motion.div className={styles.statsCard} variants={itemVariants}>
          <div className={styles.statHeader}>
            <h4 className={styles.statTitle}>Course Delivery Mode</h4>
          </div>
          
          <div className={styles.statContent}>
            <div className={styles.donutChartContainer}>
              <div className={styles.donutChart}>
                <svg viewBox="0 0 36 36" className={styles.donutSvg}>
                  {/* Background circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  
                  {/* Online percentage */}
                  {onlinePercentage > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray={`${onlinePercentage} ${100 - onlinePercentage}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  )}
                  
                  {/* Hybrid percentage */}
                  {hybridPercentage > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeDasharray={`${hybridPercentage} ${100 - hybridPercentage}`}
                      strokeDashoffset={`${100 - onlinePercentage + 25}`}
                      strokeLinecap="round"
                    />
                  )}
                  
                  {/* In-person percentage */}
                  {inPersonPercentage > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${inPersonPercentage} ${100 - inPersonPercentage}`}
                      strokeDashoffset={`${100 - onlinePercentage - hybridPercentage + 25}`}
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <div className={styles.donutLabel}>
                  <span className={styles.donutNumber}>{totalCourses}</span>
                  <span className={styles.donutText}>Courses</span>
                </div>
              </div>
            </div>
            
            <div className={styles.statLegend}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.onlineColor}`}></span>
                <span className={styles.legendLabel}>Online</span>
                <span className={styles.legendValue}>{onlineCourses}</span>
              </div>
              
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.hybridColor}`}></span>
                <span className={styles.legendLabel}>Hybrid</span>
                <span className={styles.legendValue}>{hybridCourses}</span>
              </div>
              
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.inPersonColor}`}></span>
                <span className={styles.legendLabel}>In Person</span>
                <span className={styles.legendValue}>{totalCourses - onlineCourses - hybridCourses}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div className={styles.statsCard} variants={itemVariants}>
          <div className={styles.statHeader}>
            <h4 className={styles.statTitle}>Course Difficulty Level</h4>
          </div>
          
          <div className={styles.statContent}>
            <div className={styles.barChartContainer}>
              <div className={styles.barChart}>
                <div className={styles.barGroup}>
                  <div className={styles.barLabel}>Beginner</div>
                  <div className={styles.barContainer}>
                    <div
                      className={`${styles.bar} ${styles.beginnerBar}`}
                      style={{ width: `${beginnerPercentage}%` }}
                    ></div>
                  </div>
                  <div className={styles.barValue}>{beginnerCourses}</div>
                </div>
                
                <div className={styles.barGroup}>
                  <div className={styles.barLabel}>Intermediate</div>
                  <div className={styles.barContainer}>
                    <div
                      className={`${styles.bar} ${styles.intermediateBar}`}
                      style={{ width: `${intermediatePercentage}%` }}
                    ></div>
                  </div>
                  <div className={styles.barValue}>{intermediateCourses}</div>
                </div>
                
                <div className={styles.barGroup}>
                  <div className={styles.barLabel}>Advanced</div>
                  <div className={styles.barContainer}>
                    <div
                      className={`${styles.bar} ${styles.advancedBar}`}
                      style={{ width: `${advancedPercentage}%` }}
                    ></div>
                  </div>
                  <div className={styles.barValue}>{advancedCourses}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div className={styles.statsCard} variants={itemVariants}>
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <div className={styles.quickStatIcon}>
                <BookOpen size={20} />
              </div>
              <div className={styles.quickStatContent}>
                <span className={styles.quickStatValue}>{totalCourses}</span>
                <span className={styles.quickStatLabel}>Total Courses</span>
              </div>
            </div>
            
            <div className={styles.quickStat}>
              <div className={`${styles.quickStatIcon} ${styles.onlineIcon}`}>
                <Monitor size={20} />
              </div>
              <div className={styles.quickStatContent}>
                <span className={styles.quickStatValue}>{onlineCourses}</span>
                <span className={styles.quickStatLabel}>Online Courses</span>
              </div>
            </div>
            
            <div className={styles.quickStat}>
              <div className={`${styles.quickStatIcon} ${styles.hybridIcon}`}>
                <Zap size={20} />
              </div>
              <div className={styles.quickStatContent}>
                <span className={styles.quickStatValue}>{hybridCourses}</span>
                <span className={styles.quickStatLabel}>Hybrid Courses</span>
              </div>
            </div>
            
            <div className={styles.quickStat}>
              <div className={`${styles.quickStatIcon} ${styles.trendingIcon}`}>
                <ChevronUp size={20} />
              </div>
              <div className={styles.quickStatContent}>
                <span className={styles.quickStatValue}>+12%</span>
                <span className={styles.quickStatLabel}>Monthly Growth</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TrainingStatistics;