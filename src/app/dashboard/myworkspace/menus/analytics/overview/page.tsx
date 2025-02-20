"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ViewIcon } from "lucide-react";

import styles from "./analyticsoverviewpage.module.scss";
import { courseCategories } from "../../../components/lib/mockData";
import ApacheAreaChart from "@/components/charts/Apache-ECharts/ApacheAreaChart/ApacheAreaChart";
import ApacheRadarChart from "@/components/charts/Apache-ECharts/ApacheRadarChart/ApacheRadarChart";
import ActivityTimeline from "../../../components/ui/ActivityTimeline/ActivityTimeline";
import { mockActivities } from "../../../components/ui/ActivityTimeline/data";
import OrdersTable from "../../../components/ui/DataTable/OrdersTable";
import ExamResults from "../../../components/ui/ExamResults/ExamResults";
import { examResults } from "../../../components/ui/ExamResults/mockdata";
import KPICard from "../../../components/ui/KPICard/KPICard";
import LandingPagesStats from "../../../components/ui/LandingPagesStats/LandingPagesStats";
import { mockLandingPages } from "../../../components/ui/LandingPagesStats/mockData";
import ListCardContainer from "../../../components/ui/ListCard/ListCardContainer";
import { mockProfessors } from "../../../components/ui/ProfessorList/mockData";
import ProfessorList from "../../../components/ui/ProfessorList/ProfessorList";
import { mockStudentStats } from "../../../components/ui/StudentOverview/mockData";
import StudentOverview from "../../../components/ui/StudentOverview/StudentOverview";
import WelcomeBanner from "../../../components/ui/WelcomeBanner/WelcomeBanner";
import { AnalyticsOverviewMockStatsKPI } from "../analyticsmock";

export default function MyWorkspacePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleViewAll = () => {
    console.log('View all clicked');
  };

  const handleProfessorClick = (professor) => {
    console.log('Clicked professor:', professor);
  };

  const handleViewCourses = () => {
    console.log('View courses clicked');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ""}`}>
      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>Welcome to MyWorkspace</h1>
          </motion.div>

          {/* <motion.div
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
          </motion.div> */}
        </div>

        
          {/* Stats Section */}
          <motion.div className={`${styles.bentoItem} ${styles.stats}`}>
            <div className={styles.statsGrid}>
              {AnalyticsOverviewMockStatsKPI.map((stat) => (
                <KPICard
                  key={stat.id}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  iconType={stat.iconType}
                />
              ))}
              {/* <WelcomeBanner 
              userName="Henry"
              progress={90}
              message="Keep going and boost your skills with courses."
              ctaText="View Courses"
              onCtaClick={handleViewCourses}
            /> */}
            </div>
          </motion.div>

          {/* Welcome Banner */}
          {/* <motion.div className={`${styles.bentoItem} ${styles.welcomeBanner}`}>
            <WelcomeBanner 
              userName="Henry"
              progress={90}
              message="Keep going and boost your skills with courses."
              ctaText="View Courses"
              onCtaClick={handleViewCourses}
            />
          </motion.div> */}

          {/* <div className={styles.bentoGrid}>   */}
          {/* Charts Section */}
          <motion.div className={`${styles.bentoItem} ${styles.radar}`}>
            <ApacheRadarChart />
          </motion.div>
{/* 
          <motion.div className={`${styles.bentoItem} ${styles.apacheAreaChart}`}>
            <ApacheAreaChart />
          </motion.div> */}

          {/* <motion.div className={`${styles.bentoItem} ${styles.categoriesList}`}>
            <ListCardContainer
              categories={courseCategories}
              title="Course Categories"
              button={<ViewIcon />}
              onButtonClick={() => console.log("View all clicked")}
            />
          </motion.div> */}

          {/* Activity Section */}
          {/* <motion.div className={`${styles.bentoItem} ${styles.activityTimeLine}`}>
            <ActivityTimeline 
              activities={mockActivities} 
              onViewAll={handleViewAll}
            />
          </motion.div> */}

          {/* <motion.div className={`${styles.bentoItem} ${styles.landingPagesStats}`}>
            <LandingPagesStats 
              data={mockLandingPages}
              showIcons={true}
              animated={true}
            />
          </motion.div> */}

          {/* Users Section */}
          {/* <motion.div className={`${styles.bentoItem} ${styles.professorList}`}>
            <ProfessorList 
              data={mockProfessors}
              onProfessorClick={handleProfessorClick}
            />
          </motion.div> */}

          {/* <motion.div className={`${styles.bentoItem} ${styles.studentOverview}`}>
            <StudentOverview 
              data={mockStudentStats}
              title="Students Overview"
            />
          </motion.div> */}

          {/* Data Table */}
          {/* <motion.div className={`${styles.bentoItem} ${styles.dataTable}`}>
            <OrdersTable />
          </motion.div> */}

          {/* Exam Results */}
          <motion.div className={`${styles.bentoItem} ${styles.examResults}`}>
            <ExamResults 
              data={examResults}
              onViewAll={handleViewAll}
            />
          </motion.div>
        {/* </div> */}
      </main>
    </div>
  );
}