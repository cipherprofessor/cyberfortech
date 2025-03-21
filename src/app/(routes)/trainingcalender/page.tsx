"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

import styles from './page.module.scss';
import TrainingHeader from '@/components/trainingcalender/TrainingHeader/TrainingHeader';
import CoursesFilterBar from '@/components/trainingcalender/CoursesFilterBar/CoursesFilterBar';
import TrainingCalendarTable from '@/components/trainingcalender/TrainingCalendarTable/TrainingCalendarTable';
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
  EnrollmentData,
  checkUserEnrollments
} from '@/services/enrollment-service';

import { toast } from '@/components/ui/mohsin-toast';
import EnrollmentModal from '@/components/trainingcalender/EnrollmentModal/EnrollmentModal/EnrollmentModal';
import { TrainingCourseWithEnrollment } from '@/components/trainingcalender/UpcomingHighlights/types';

// UI Course type that matches our component expectations
export interface UITrainingCourse {
  id: string;
  title: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string; // This is optional
  instructor: string;
  availability: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  prerequisites?: string[];
  certification?: string;
  language: string;
  enrollmentStatus?: string;
}

// Type for the EnrollmentModal's form data
interface ModalEnrollmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  comments: string;
  agreeTerms: boolean;
  courseId: string;
}

export default function TrainingCalendarPage() {
  // Get auth state
  const { isAuthenticated, user } = useAuth();
  
  // State for courses and UI
  const [courses, setCourses] = useState<UITrainingCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<UITrainingCourse[]>([]);
  
  // Use a single loading state to prevent UI from showing stale data
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

  // Fetch courses and enrollment status simultaneously
  useEffect(() => {
    let isMounted = true;
    
    const fetchCoursesAndEnrollments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get API filters - exclude month which we'll handle client-side
        const apiFilters: CourseFilters = { ...filters };
        delete apiFilters.dateFrom;
        delete apiFilters.dateTo;
        
        // Start course fetch
        const coursesPromise = getCourses(apiFilters);
        
        // Get courses first
        const coursesResponse = await coursesPromise;
        const uiCourses: UITrainingCourse[] = coursesResponse.courses.map(transformCourseForDisplay);
        const upcomingUIcourses = getUpcomingCourses(coursesResponse.courses, 3).map(transformCourseForDisplay);
        
        // If user is authenticated, prepare to check enrollments
        if (isAuthenticated && user) {
          // Get all course IDs, including upcoming courses
          const allCourseIds = [...new Set([
            ...uiCourses.map(course => course.id),
            ...upcomingUIcourses.map(course => course.id)
          ])];
          
          try {
            // Check enrollments for all courses at once
            const enrollmentsMap = await checkUserEnrollments(allCourseIds);
            
            // Update all courses with enrollment status
            uiCourses.forEach(course => {
              if (enrollmentsMap.has(course.id)) {
                course.enrollmentStatus = enrollmentsMap.get(course.id);
              }
            });
            
            // Update upcoming courses with enrollment status
            upcomingUIcourses.forEach(course => {
              if (enrollmentsMap.has(course.id)) {
                course.enrollmentStatus = enrollmentsMap.get(course.id);
              }
            });
          } catch (err) {
            console.error('Error checking enrollments:', err);
            // Continue with courses even if enrollment check fails
          }
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          setCourses(uiCourses);
          setUpcomingCourses(upcomingUIcourses);
          setStats(calculateCourseStatistics(coursesResponse.courses));
          applyClientFilters(uiCourses);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
        if (isMounted) {
          setError(errorMessage);
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'error'
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchCoursesAndEnrollments();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [filters.search, filters.category, filters.mode, filters.level, isAuthenticated, user]);

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
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to enroll in courses',
        variant: 'warning'
      });
      return;
    }
    
    // Check if user is already enrolled in this course
    if (course.enrollmentStatus) {
      toast({
        title: 'Already Enrolled',
        description: `You are already enrolled in "${course.title}" with status: ${course.enrollmentStatus}`,
        variant: 'info'
      });
      return;
    }
    
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  // Handle enrollment submission - receives form data from the modal
  const handleEnrollmentSubmit = async (formData: ModalEnrollmentFormData) => {
    if (!selectedCourse) return;
    
    setIsEnrolling(true);
    
    try {
      // Transform the form data from the modal for the enrollment service
      const enrollmentData: EnrollmentData = {
        courseId: formData.courseId,
        // Set initial status values
        status: 'pending',
        paymentStatus: 'pending',
        // Store user details in metadata
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
      
      // Update courses to show enrollment status
      const updatedCourses = courses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            enrollmentStatus: 'pending'
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      applyClientFilters(updatedCourses);
      
      // Also update upcoming courses if the enrolled course is there
      const updatedUpcomingCourses = upcomingCourses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            enrollmentStatus: 'pending'
          };
        }
        return course;
      });
      
      setUpcomingCourses(updatedUpcomingCourses);
      
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
            isAuthenticated={isAuthenticated}
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
          
          {/* Upcoming Highlights - Make sure it accepts UITrainingCourse[] type */}
          <UpcomingHighlights 
  upcomingCourses={upcomingCourses as unknown as TrainingCourseWithEnrollment[]} 
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