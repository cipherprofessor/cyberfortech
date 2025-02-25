'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the types for our data
interface CourseBasic {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: string;
  level?: string;
  category?: string;
  instructor_id?: string;
  instructor_name?: string;
  instructor_profile_image_url?: string;
  image_url: string;
  total_students?: number;
  total_reviews?: number;
  average_rating?: number;
  created_at?: string;
  updated_at?: string;
}

interface CourseContent {
  courseContent: {
    course_demo_url: string;
    course_outline: string;
    learning_objectives: string[];
    prerequisites: string[];
    target_audience: string;
    estimated_completion_time: string;
    course_title: string;
    course_description: string;
    image_url: string;
    level: string;
    instructor_name: string;
  };
  sections: Section[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: string;
  duration: number;
  isFreePreview: boolean;
  sequenceNumber: number;
  progress?: string;
  content: {
    videoUrl: string | null;
    articleContent: string | null;
    quizData: any | null;
    assignmentDetails: any | null;
  };
}

interface Section {
  id: string;
  title: string;
  description: string;
  sequence_number: number;
  lessons: Lesson[];
}

// Context state type
interface CourseDataContextType {
  courseBasic: CourseBasic | null;
  courseContent: CourseContent | null;
  isLoadingBasic: boolean;
  isLoadingContent: boolean;
  errorBasic: string | null;
  errorContent: string | null;
  refetchBasic: () => Promise<void>;
  refetchContent: () => Promise<void>;
}

// Create the context
const CourseDataContext = createContext<CourseDataContextType | undefined>(undefined);

// Provider props
interface CourseDataProviderProps {
  courseId: string;
  children: ReactNode;
}

// Provider component
export const CourseDataProvider: React.FC<CourseDataProviderProps> = ({ courseId, children }) => {
  const [courseBasic, setCourseBasic] = useState<CourseBasic | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoadingBasic, setIsLoadingBasic] = useState<boolean>(true);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [errorBasic, setErrorBasic] = useState<string | null>(null);
  const [errorContent, setErrorContent] = useState<string | null>(null);

  // Fetch basic course data
  const fetchCourseBasic = async () => {
    if (!courseId) {
      setErrorBasic('Course ID is required');
      setIsLoadingBasic(false);
      return;
    }

    try {
      setIsLoadingBasic(true);
      const { data } = await axios.get(`/api/courses/${courseId}`);
      setCourseBasic(data);
      setErrorBasic(null);
    } catch (err) {
      setErrorBasic('Failed to load course details');
      console.error('Error fetching course basic data:', err);
    } finally {
      setIsLoadingBasic(false);
    }
  };

  // Fetch course content data
  const fetchCourseContent = async () => {
    if (!courseId) {
      setErrorContent('Course ID is required');
      setIsLoadingContent(false);
      return;
    }

    try {
      setIsLoadingContent(true);
      const { data } = await axios.get(`/api/courses/${courseId}/content`);
      setCourseContent(data);
      setErrorContent(null);
    } catch (err) {
      setErrorContent('Failed to load course content');
      console.error('Error fetching course content:', err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourseBasic();
    fetchCourseContent();
  }, [courseId]);

  const value = {
    courseBasic,
    courseContent,
    isLoadingBasic,
    isLoadingContent,
    errorBasic,
    errorContent,
    refetchBasic: fetchCourseBasic,
    refetchContent: fetchCourseContent,
  };

  return <CourseDataContext.Provider value={value}>{children}</CourseDataContext.Provider>;
};

// Hook to use the context
export const useCourseData = () => {
  const context = useContext(CourseDataContext);
  if (context === undefined) {
    throw new Error('useCourseData must be used within a CourseDataProvider');
  }
  return context;
};