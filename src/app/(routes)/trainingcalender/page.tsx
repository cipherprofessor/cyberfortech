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

// Interface for training course data
interface TrainingCourse {
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

export default function TrainingCalendarPage() {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<TrainingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);

  // Simulated fetch of training courses data
  useEffect(() => {
    // This would be an API call in a real application
    const fetchCourses = async () => {
      setIsLoading(true);
      
      // Simulated delay for API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample training course data
      const sampleCourses: TrainingCourse[] = [
        {
          id: 'course-001',
          title: 'Cybersecurity Fundamentals',
          dates: '22 Mar - 20 Apr',
          time: '19:00 - 23:00 IST',
          duration: '4 weeks',
          mode: 'online',
          instructor: 'John Smith',
          availability: 15,
          price: 599,
          level: 'beginner',
          category: 'Security',
          description: 'Learn the essential concepts and practices of cybersecurity.',
          prerequisites: ['Basic IT knowledge'],
          certification: 'CyberFort Security Fundamentals',
          language: 'English'
        },
        {
          id: 'course-002',
          title: 'Advanced Penetration Testing',
          dates: '23 Mar - 03 May',
          time: '09:00 - 13:00 IST',
          duration: '6 weeks',
          mode: 'online',
          instructor: 'Sarah Johnson',
          availability: 5,
          price: 1299,
          level: 'advanced',
          category: 'Security',
          description: 'Master the art of ethical hacking and penetration testing.',
          prerequisites: ['Basic network knowledge', 'Linux command line experience'],
          certification: 'CyberFort Advanced Penetration Tester',
          language: 'English'
        },
        {
          id: 'course-003',
          title: 'Cloud Security Architecture',
          dates: '29 Mar - 20 Apr',
          time: '19:00 - 23:00 IST',
          duration: '4 weeks',
          mode: 'hybrid',
          location: 'New York & Online',
          instructor: 'Michael Chen',
          availability: 20,
          price: 899,
          level: 'intermediate',
          category: 'Cloud',
          description: 'Design and implement secure cloud architectures.',
          prerequisites: ['Cloud computing basics', 'Basic security knowledge'],
          certification: 'CyberFort Cloud Security Architect',
          language: 'English'
        },
        {
          id: 'course-004',
          title: 'Secure Coding Practices',
          dates: '29 Mar - 27 Apr',
          time: '19:00 - 23:00 IST',
          duration: '4 weeks',
          mode: 'online',
          instructor: 'Elena Rodriguez',
          availability: 25,
          price: 749,
          level: 'intermediate',
          category: 'Development',
          description: 'Learn to write secure code and avoid common vulnerabilities.',
          prerequisites: ['Programming experience in any language'],
          certification: 'CyberFort Secure Coder',
          language: 'English'
        },
        {
          id: 'course-005',
          title: 'Incident Response and Forensics',
          dates: '30 Mar - 10 May',
          time: '19:00 - 23:00 IST',
          duration: '6 weeks',
          mode: 'online',
          instructor: 'David Kim',
          availability: 10,
          price: 999,
          level: 'advanced',
          category: 'Security',
          description: 'Develop skills to effectively respond to security incidents and conduct digital forensics.',
          prerequisites: ['Basic security knowledge', 'Network fundamentals'],
          certification: 'CyberFort Incident Responder',
          language: 'English'
        },
        {
          id: 'course-006',
          title: 'Blockchain Security',
          dates: '05 Apr - 15 May',
          time: '18:00 - 21:00 IST',
          duration: '6 weeks',
          mode: 'online',
          instructor: 'Aisha Patel',
          availability: 18,
          price: 1099,
          level: 'advanced',
          category: 'Blockchain',
          description: 'Understand security concepts specific to blockchain technologies.',
          prerequisites: ['Cryptography basics', 'Blockchain fundamentals'],
          certification: 'CyberFort Blockchain Security Specialist',
          language: 'English'
        }
      ];
      
      setCourses(sampleCourses);
      setFilteredCourses(sampleCourses);
      setIsLoading(false);
    };
    
    fetchCourses();
  }, []);

  // Filter courses based on search term and filters
  useEffect(() => {
    let result = [...courses];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }
    
    // Apply mode filter
    if (selectedMode !== 'all') {
      result = result.filter(course => course.mode === selectedMode);
    }
    
    // Apply level filter
    if (selectedLevel !== 'all') {
      result = result.filter(course => course.level === selectedLevel);
    }
    
    // Apply month filter
    if (selectedMonth !== 'all') {
      // Extract month from the start date
      result = result.filter(course => {
        const dateStr = course.dates.split(' - ')[0]; // Get the start date
        const month = dateStr.split(' ')[1]; // Get the month abbreviation
        return month.toLowerCase() === selectedMonth.toLowerCase();
      });
    }
    
    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory, selectedMode, selectedMonth, selectedLevel]);

  // Function to handle course enrollment
  const handleEnroll = (course: TrainingCourse) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  // Function to handle search term change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Function to handle filter changes
  const handleFilterChange = (
    category: string,
    mode: string,
    month: string,
    level: string
  ) => {
    setSelectedCategory(category);
    setSelectedMode(mode);
    setSelectedMonth(month);
    setSelectedLevel(level);
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
          {/* Filter Bar */}
          <CoursesFilterBar 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            selectedCategory={selectedCategory}
            selectedMode={selectedMode}
            selectedMonth={selectedMonth}
            selectedLevel={selectedLevel}
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
          {/* Training Statistics */}
          <TrainingStatistics 
            totalCourses={courses.length}
            onlineCourses={courses.filter(c => c.mode === 'online').length}
            hybridCourses={courses.filter(c => c.mode === 'hybrid').length}
            beginnerCourses={courses.filter(c => c.level === 'beginner').length}
            intermediateCourses={courses.filter(c => c.level === 'intermediate').length}
            advancedCourses={courses.filter(c => c.level === 'advanced').length}
          />
          
          {/* Upcoming Highlights */}
          <UpcomingHighlights 
            upcomingCourses={courses.slice(0, 3)} 
          />
        </div>
      </div>
      
      {/* Enrollment Modal */}
      {showEnrollModal && selectedCourse && (
        <EnrollmentModal 
          course={selectedCourse}
          onClose={() => setShowEnrollModal(false)}
          onSubmit={(formData) => {
            console.log('Enrollment data:', formData);
            setShowEnrollModal(false);
            // In a real app, this would submit to an API
          }}
        />
      )}
    </motion.div>
  );
}