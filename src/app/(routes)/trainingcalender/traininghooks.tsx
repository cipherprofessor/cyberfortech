"use client"
import { useState, useEffect } from 'react';

// Types
export interface TrainingCourse {
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

export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor: string;
  maxCapacity: number;
  currentEnrollment: number;
  availability: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  prerequisites: string[];
  certification?: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentData {
  courseId: string;
  paymentId?: string;
  paymentMethod?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export interface FilterOptions {
  search?: string;
  category?: string;
  mode?: string;
  month?: string;
  level?: string;
  page?: number;
  limit?: number;
}

// Transform API course to our format
const transformApiCourse = (apiCourse: ApiCourse): TrainingCourse => ({
  id: apiCourse.id,
  title: apiCourse.title,
  dates: apiCourse.dates,
  time: apiCourse.time,
  duration: apiCourse.duration,
  mode: apiCourse.mode,
  location: apiCourse.location,
  instructor: apiCourse.instructor,
  availability: apiCourse.availability,
  price: apiCourse.price,
  level: apiCourse.level,
  category: apiCourse.category,
  description: apiCourse.description,
  prerequisites: apiCourse.prerequisites,
  certification: apiCourse.certification,
  language: apiCourse.language
});

// Hook for fetching courses
export const useTrainingCourses = (initialFilters?: FilterOptions) => {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<TrainingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch courses from API
  const fetchCourses = async (options?: FilterOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      const currentFilters = options || filters;
      
      if (currentFilters.page) queryParams.append('page', currentFilters.page.toString());
      if (currentFilters.limit) queryParams.append('limit', currentFilters.limit.toString());
      if (currentFilters.category && currentFilters.category !== 'all') {
        queryParams.append('category', currentFilters.category);
      }
      if (currentFilters.mode && currentFilters.mode !== 'all') {
        queryParams.append('mode', currentFilters.mode);
      }
      if (currentFilters.level && currentFilters.level !== 'all') {
        queryParams.append('level', currentFilters.level);
      }
      if (currentFilters.search) queryParams.append('search', currentFilters.search);
      
      // Fetch courses from API
      const response = await fetch(`/api/training/courses?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      
      // Transform API courses to our format
      const transformedCourses: TrainingCourse[] = data.courses.map(transformApiCourse);
      
      setCourses(transformedCourses);
      setFilteredCourses(transformedCourses);
      setPagination(data.pagination);
      setTotalCourses(data.pagination.total);
      
      // Extract unique categories for filtering UI
      const uniqueCategories = Array.from(
        new Set(transformedCourses.map(course => course.category))
      );
      setCategories(uniqueCategories);
      
      return transformedCourses;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Apply client-side filters (for month filtering which is not handled by API)
  const applyClientFilters = (coursesToFilter: TrainingCourse[]) => {
    let result = [...coursesToFilter];
    
    // Apply month filter (this is handled client-side because it requires parsing the date format)
    if (filters.month && filters.month !== 'all') {
      result = result.filter(course => {
        const dateStr = course.dates.split(' - ')[0]; // Get the start date
        const monthStr = dateStr.split(' ')[1]; // Get the month abbreviation
        return monthStr.toLowerCase() === filters.month?.toLowerCase();
      });
    }
    
    setFilteredCourses(result);
  };

  // Update filters and fetch new data
  const updateFilters = async (newFilters: FilterOptions) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Fetch new data with updated filters
    const courses = await fetchCourses(updatedFilters);
    
    // Apply any client-side filters that can't be handled by the API
    applyClientFilters(courses);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchCourses(filters);
  }, []);

  return {
    courses,
    filteredCourses,
    isLoading,
    error,
    filters,
    categories,
    totalCourses,
    pagination,
    updateFilters,
    fetchCourses,
    applyClientFilters
  };
};

// Hook for enrolling in a course
export const useEnrollCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const enrollInCourse = async (enrollmentData: EnrollmentData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(`/api/training/courses/${enrollmentData.courseId}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: enrollmentData.paymentId,
          status: enrollmentData.status || 'pending',
          paymentStatus: enrollmentData.paymentStatus || 'pending'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll in course');
      }
      
      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in course');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enrollInCourse,
    isLoading,
    error,
    success
  };
};

// Hook for fetching user enrollments
export const useUserEnrollments = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/training/user/enrollments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      
      const data = await response.json();
      setEnrollments(data.enrollments);
      return data.enrollments;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch enrollments');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return {
    enrollments,
    isLoading,
    error,
    fetchEnrollments
  };
};