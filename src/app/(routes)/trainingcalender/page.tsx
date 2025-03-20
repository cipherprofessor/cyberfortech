"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


import styles from './page.module.scss';
import TrainingHeader from '@/components/trainingcalender/TrainingHeader/TrainingHeader';
import CoursesFilterBar from '@/components/trainingcalender/CoursesFilterBar/CoursesFilterBar';
import TrainingCalendarTable from '@/components/trainingcalender/TrainingCalendarTable/TrainingCalendarTable';
import EnrollmentModal from '@/components/trainingcalender/EnrollmentModal/EnrollmentModal';
import UpcomingHighlights from '@/components/trainingcalender/UpcomingHighlights/UpcomingHighlights';
import TrainingStatistics from '@/components/trainingcalender/TrainingStatistics/TrainingStatistics';

// Import our services
import { 
  getCourses, 
  transformCourseForDisplay, 
  calculateCourseStatistics,
  getUpcomingCourses,
  CourseFilters,
  Course
} from '@/services/course-service';

import {
  enrollInCourse,
  EnrollmentData
} from '@/services/enrollment-service';
import { toast } from '@/components/ui/mohsin-toast';

// UI Course type that matches our component expectations
interface UITrainingCourse {
  id: string;
  title: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor: string;
  availability: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  prerequisites?: string[];
  certification?: string;
  language: string;
}

// Type for the EnrollmentModal's form data
interface ModalEnrollmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  paymentMethod: 'credit_card' | 'invoice' | 'bank_transfer';
  comments: string;
  agreeTerms: boolean;
  courseId: string;
}

export default function TrainingCalendarPage() {
  // State for courses and UI
  const [courses, setCourses] = useState<UITrainingCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<UITrainingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 50 // Get more courses to allow client-side filtering
  });
  
  // Modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<UITrainingCourse | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  // Statistics state
  const [stats, setStats] = useState({
    totalCourses: 0,
    onlineCourses: 0,
    hybridCourses: 0,
    inPersonCourses: 0,
    beginnerCourses: 0,
    intermediateCourses: 0,
    advancedCourses: 0
  });
  
  // Upcoming courses
  const [upcomingCourses, setUpcomingCourses] = useState<UITrainingCourse[]>([]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCoursesData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get API filters - exclude month which we'll handle client-side
        const apiFilters: CourseFilters = { ...filters };
        delete apiFilters.dateFrom; // We'll handle date filtering on client side
        delete apiFilters.dateTo;   // for more flexibility with our date format
        
        // Fetch courses from API
        const response = await getCourses(apiFilters);
        
        // Transform courses to UI format
        const uiCourses: UITrainingCourse[] = response.courses.map(transformCourseForDisplay);
        
        setCourses(uiCourses);
        
        // Calculate statistics
        setStats(calculateCourseStatistics(response.courses));
        
        // Get upcoming courses
        setUpcomingCourses(getUpcomingCourses(response.courses, 3).map(transformCourseForDisplay));
        
        // Apply any client-side filters (month)
        applyClientFilters(uiCourses);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoursesData();
  }, [filters.search, filters.category, filters.mode, filters.level]);

  // Apply client-side filters (for month filtering)
  const applyClientFilters = (coursesToFilter: UITrainingCourse[]) => {
    let result = [...coursesToFilter];
    
    // Filter by month if specified
    if (filters.dateFrom) {
      const monthStr = filters.dateFrom.toLowerCase();
      if (monthStr !== 'all') {
        result = result.filter(course => {
          const dateStr = course.dates.split(' - ')[0]; // Get the start date
          const courseMonth = dateStr.split(' ')[1]; // Get the month abbreviation
          return courseMonth.toLowerCase() === monthStr;
        });
      }
    }
    
    setFilteredCourses(result);
  };

  // Handle search term change
  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  // Handle filter changes
  const handleFilterChange = (
    category: string,
    mode: string,
    month: string,
    level: string
  ) => {
    setFilters(prev => ({
      ...prev,
      category: category !== 'all' ? category : undefined,
      mode: mode !== 'all' ? mode : undefined,
      level: level !== 'all' ? level : undefined,
      dateFrom: month !== 'all' ? month : undefined
    }));
  };

  // Handle course enrollment
  const handleEnroll = (course: UITrainingCourse) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  // Handle enrollment submission - receives form data from the modal
  const handleEnrollmentSubmit = async (formData: ModalEnrollmentFormData) => {
    if (!selectedCourse) return;
    
    setIsEnrolling(true);
    
    try {
      // Transform the form data from the modal to the format expected by the enrollment service
      const enrollmentData: EnrollmentData = {
        courseId: formData.courseId,
        // Generate a payment ID if the method is credit card
        paymentId: formData.paymentMethod === 'credit_card' ? `cc-${Date.now()}` : undefined,
        // Include the payment method for reference
        paymentMethod: formData.paymentMethod,
        // Set initial status values
        status: 'pending',
        paymentStatus: 'pending',
        // Store user details in metadata if you need them later
        metadata: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          comments: formData.comments
        }
      };
      
      // Call the enrollment service
      await enrollInCourse(formData.courseId, enrollmentData);
      
      toast({
        title: 'Enrollment Successful',
        description: `You've been enrolled in ${selectedCourse.title}. Check your email for confirmation.`,
        variant: 'default'
      });
      
      // Refresh course data to update availability
      const response = await getCourses(filters);
      const uiCourses: UITrainingCourse[] = response.courses.map(transformCourseForDisplay);
      setCourses(uiCourses);
      applyClientFilters(uiCourses);
      
      setShowEnrollModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in course';
      toast({
        title: 'Enrollment Failed',
        description: errorMessage,
        variant: 'error'
      });
    } finally {
      setIsEnrolling(false);
    }
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

  return (
    <motion.div 
      className={styles.calendarPage}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <TrainingHeader 
        totalCourses={courses.length} 
        availableCourses={filteredCourses.length} 
      />
      
      {/* Main Content */}
      <div className={styles.contentLayout}>
        {/* Main Section */}
        <div className={styles.mainSection}>
          {/* Filter Bar - Using your existing component */}
          <CoursesFilterBar 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            selectedCategory={filters.category || 'all'}
            selectedMode={filters.mode || 'all'}
            selectedMonth={filters.dateFrom || 'all'}
            selectedLevel={filters.level || 'all'}
          />
          
          {/* Training Calendar Table */}
          <TrainingCalendarTable 
            courses={filteredCourses}
            isLoading={isLoading}
            onEnroll={handleEnroll}
          />
        </div>
        
        {/* Side Section */}
        <div className={styles.sideSection}>
          {/* Training Statistics - Using your existing component */}
          <TrainingStatistics 
            totalCourses={stats.totalCourses}
            onlineCourses={stats.onlineCourses}
            hybridCourses={stats.hybridCourses}
            beginnerCourses={stats.beginnerCourses}
            intermediateCourses={stats.intermediateCourses}
            advancedCourses={stats.advancedCourses}
          />
          
          {/* Upcoming Highlights */}
          <UpcomingHighlights 
            upcomingCourses={upcomingCourses} 
          />
        </div>
      </div>
      
      {/* Enrollment Modal */}
      {showEnrollModal && selectedCourse && (
        <EnrollmentModal 
          course={selectedCourse}
          onClose={() => setShowEnrollModal(false)}
          onSubmit={handleEnrollmentSubmit}
          isProcessing={isEnrolling}
        />
      )}
    </motion.div>
  );
}