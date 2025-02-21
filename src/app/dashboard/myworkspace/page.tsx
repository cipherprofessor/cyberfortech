"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ViewIcon } from "lucide-react";

import styles from "./page.module.scss";

import KPICard from "./components/ui/KPICard/KPICard";
import { courseCategories, mockStats } from "./components/lib/mockData";
import ListCardContainer from "./components/ui/ListCard/ListCardContainer";
import ApacheRadarChart from "@/components/charts/Apache-ECharts/ApacheRadarChart/ApacheRadarChart";
import ApacheAreaChart from "@/components/charts/Apache-ECharts/ApacheAreaChart/ApacheAreaChart";
import TopSellingCategories from "./components/ui/ListCardCategories/ListCardCategories";
import OrdersTable from "./components/ui/DataTable/OrdersTable";
import ActivityTimeline from "./components/ui/ActivityTimeline/ActivityTimeline";
import { mockActivities } from "./components/ui/ActivityTimeline/data";
import LandingPagesStats from "./components/ui/LandingPagesStats/LandingPagesStats";
import { mockLandingPages } from "./components/ui/LandingPagesStats/mockData";
import ProfessorList from "./components/ui/ProfessorList/ProfessorList";
import { mockProfessors } from "./components/ui/ProfessorList/mockData";
import StudentOverview from "./components/ui/StudentOverview/StudentOverview";
import { mockStudentStats } from "./components/ui/StudentOverview/mockData";
import WelcomeBanner from "./components/ui/WelcomeBanner/WelcomeBanner";
import ExamResults from "./components/ui/ExamResults/ExamResults";
import { examResults } from "./components/ui/ExamResults/mockdata";
import { teachersList } from "./components/ui/TeachersList/mockData";
import TeachersList from "./components/ui/TeachersList/TeachersList";
import { SuperAdminSidebar } from "./components/Sidebar/Sidebar";


export default function MyWorkspacePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const handleViewAll = () => {
    // Handle view all click
    console.log('View all clicked');
  };

  
    const handleProfessorClick = (professor) => {
      console.log('Clicked professor:', professor);
      // Handle navigation or modal opening
    };

    const handleViewCourses = () => {
      // Handle navigation or modal open
      console.log('View courses clicked');
    };

    const handleViewAllResults = () => {
      console.log('View all clicked');
    };

    const handleTeacherClick = (teacher) => {
      console.log('Teacher clicked:', teacher);
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
      <SuperAdminSidebar />

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
              onButtonClick={() => console.log("View all clicked")}
            />
          </motion.div>

          <motion.div
            className={`${styles.bentoItem} ${styles.cardCategories}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* <div className="p-6">
              <TopSellingCategories
                data={mockCategories}
                title="Top Selling Categories"
                showIcons={true}
                animated={true}
                sortable={true}
              />
            </div> */}
          </motion.div>

        
          {/* Add more bento items here */}
        </div>

        <motion.div
            className={`${styles.bentoItem} ${styles.dataTable}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            <OrdersTable />
            </div>
          </motion.div>


          <motion.div
            className={`${styles.bentoItem} ${styles.activityTimeLine}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            <ActivityTimeline 
        activities={mockActivities} 
        onViewAll={handleViewAll}
      />
      
            </div>
          </motion.div>

          <motion.div
            className={`${styles.bentoItem} ${styles.landingPagesStats}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            <LandingPagesStats 
        data={mockLandingPages}
        showIcons={true}
        animated={true}
      />
      
            </div>
          </motion.div>


         
          

          <motion.div
            className={`${styles.bentoItem} ${styles.professorList}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            <ProfessorList 
        data={mockProfessors}
        onProfessorClick={handleProfessorClick}
      />
      
            </div>
          </motion.div>




          <motion.div
            className={`${styles.bentoItem} ${styles.studentOverview }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            <StudentOverview 
        data={mockStudentStats}
        title="Students Overview"
      />
      
            </div>
          </motion.div>



          <motion.div
            className={`${styles.bentoItem} ${styles.welcomeBanner }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
             <WelcomeBanner 
        userName="Henry"
        progress={90}
        message="Keep going and boost your skills with courses."
        ctaText="View Courses"
        onCtaClick={handleViewCourses}
      />
      
            </div>
          </motion.div>
        
        
          


<motion.div
            className={`${styles.bentoItem} ${styles.welcomeBanner }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            <ExamResults 
        data={examResults}
        onViewAll={handleViewAll}
      />
      
            </div>
          </motion.div>



          <motion.div
            className={`${styles.bentoItem} ${styles.welcomeBanner }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
            
      
            </div>
          </motion.div>






      </main>
    </div>
  );
}
