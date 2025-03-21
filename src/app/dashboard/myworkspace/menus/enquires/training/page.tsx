"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Users, 
  Calendar, 
  BarChart2, 
  PlusCircle, 
  RefreshCcw,
  Search,
  Filter
} from 'lucide-react';

import styles from './page.module.scss';


import { Course, CourseFilters } from '@/services/course-service';
import CreateCourseModal from './components/CreateCourseModal/CreateCourseModal';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import EditCourseModal from './components/EditCourseModal/EditCourseModal';
import EnrollmentsList from './components/EnrollmentsList/EnrollmentsList';
import FilterPanel from './components/FilterPanel/FilterPanel';
import InsightsPanel from './components/InsightsPanel/InsightsPanel';
import TrainingCoursesList from './components/TrainingCoursesList/TrainingCoursesList';
import WaitlistPanel from './components/WaitlistPanel/WaitlistPanel';

// Tab types for the dashboard sections
type DashboardTab = 'courses' | 'enrollments' | 'waitlist' | 'insights';

export default function TrainingAdminDashboard() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<DashboardTab>('courses');
  
  // UI state for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 10
  });
  
  // Stats data (would be fetched from API in useEffect)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    enrollmentRate: 0,
    popularCategory: ''
  });

  // Handle tab change
  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  // Handle create course
  const handleCreateCourse = () => {
    setIsCreateModalOpen(true);
  };

  // Handle edit course
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: CourseFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
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

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.dashboardContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Dashboard Header */}
      <DashboardHeader 
        stats={stats}
      />
      
      {/* Main Content Area */}
      <div className={styles.contentContainer}>
        {/* Sidebar / Navigation */}
        <div className={styles.sidebar}>
          <div className={styles.navigationMenu}>
            <button 
              className={`${styles.navButton} ${activeTab === 'courses' ? styles.active : ''}`}
              onClick={() => handleTabChange('courses')}
            >
              <Layers size={20} />
              <span>Courses</span>
            </button>
            
            <button 
              className={`${styles.navButton} ${activeTab === 'enrollments' ? styles.active : ''}`}
              onClick={() => handleTabChange('enrollments')}
            >
              <Users size={20} />
              <span>Enrollments</span>
            </button>
            
            <button 
              className={`${styles.navButton} ${activeTab === 'waitlist' ? styles.active : ''}`}
              onClick={() => handleTabChange('waitlist')}
            >
              <Calendar size={20} />
              <span>Waitlist</span>
            </button>
            
            <button 
              className={`${styles.navButton} ${activeTab === 'insights' ? styles.active : ''}`}
              onClick={() => handleTabChange('insights')}
            >
              <BarChart2 size={20} />
              <span>Insights</span>
            </button>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.createButton}
              onClick={handleCreateCourse}
            >
              <PlusCircle size={18} />
              <span>Create Course</span>
            </button>
            
            <button 
              className={styles.refreshButton}
              onClick={() => window.location.reload()}
            >
              <RefreshCcw size={18} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
        
        {/* Main Content Panel */}
        <div className={styles.mainPanel}>
          {/* Action Bar */}
          <div className={styles.actionBar}>
            <div className={styles.searchContainer}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search..." 
                className={styles.searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <button 
              className={`${styles.filterButton} ${isFilterPanelOpen ? styles.active : ''}`}
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            >
              <Filter size={18} />
              <span>Filters</span>
              {Object.keys(filters).length > 2 && (
                <span className={styles.filterBadge}>{Object.keys(filters).length - 2}</span>
              )}
            </button>
          </div>
          
          {/* Filter Panel - Conditional Render */}
          {isFilterPanelOpen && (
            <FilterPanel 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setIsFilterPanelOpen(false)}
            />
          )}
          
          {/* Tab Content */}
          <motion.div 
            className={styles.tabContent}
            variants={contentVariants}
            key={activeTab} // This forces re-animation when tab changes
          >
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <TrainingCoursesList 
                filters={filters}
                onEditCourse={handleEditCourse}
              />
            )}
            
            {/* Enrollments Tab */}
            {activeTab === 'enrollments' && (
              <EnrollmentsList 
                filters={filters}
              />
            )}
            
            {/* Waitlist Tab */}
            {activeTab === 'waitlist' && (
              <WaitlistPanel 
                filters={filters}
              />
            )}
            
            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <InsightsPanel />
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Modals */}
      {isCreateModalOpen && (
        <CreateCourseModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            // Refresh the courses list
            window.location.reload();
          }}
        />
      )}
      
      {isEditModalOpen && selectedCourse && (
        <EditCourseModal 
          course={selectedCourse}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCourse(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedCourse(null);
            // Refresh the courses list
            window.location.reload();
          }}
        />
      )}
    </motion.div>
  );
}