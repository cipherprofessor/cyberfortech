// src/services/course-service.ts

/**
 * Service for handling all course-related API calls
 */

export interface Course {
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
    enrollmentStatus?: string;
  }
  
  export interface CourseFilters {
    level?: string;
    category?: string;
    mode?: string;
    dateFrom?: string;
    dateTo?: string;
    instructor?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
  
  export interface CoursesResponse {
    courses: Course[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  export interface CourseCreateData {
    title: string;
    description: string;
    dates: string;
    time: string;
    duration: string;
    mode: 'online' | 'in-person' | 'hybrid';
    location?: string;
    instructor: string;
    maxCapacity: number;
    price: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    prerequisites?: string[];
    certification?: string;
    language: string;
  }
  
  export interface CourseUpdateData {
    title?: string;
    description?: string;
    dates?: string;
    time?: string;
    duration?: string;
    mode?: 'online' | 'in-person' | 'hybrid';
    location?: string;
    instructor?: string;
    maxCapacity?: number;
    price?: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    prerequisites?: string[];
    certification?: string;
    language?: string;
    isActive?: boolean;
  }
  
  /**
   * Get all courses with optional filtering
   */
  export async function getCourses(filters?: CourseFilters): Promise<CoursesResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.level) params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);
      if (filters.mode) params.append('mode', filters.mode);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.search) params.append('search', filters.search);
    }
  
    const response = await fetch(`/api/training/courses?${params.toString()}`);
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch courses');
    }
  
    return response.json();
  }
  
  /**
   * Get a specific course by ID
   */
  export async function getCourse(courseId: string): Promise<Course> {
    const response = await fetch(`/api/training/courses/${courseId}`);
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch course');
    }
  
    return response.json();
  }
  
  /**
   * Create a new course (admin only)
   */
  export async function createCourse(data: CourseCreateData): Promise<Course> {
    const response = await fetch('/api/training/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create course');
    }
  
    return response.json();
  }
  
  /**
   * Update an existing course (admin only)
   */
  export async function updateCourse(courseId: string, data: CourseUpdateData): Promise<Course> {
    const response = await fetch(`/api/training/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update course');
    }
  
    return response.json();
  }
  
  /**
   * Delete a course (admin only)
   */
  export async function deleteCourse(courseId: string): Promise<{ message: string }> {
    const response = await fetch(`/api/training/courses/${courseId}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete course');
    }
  
    return response.json();
  }
  
  /**
   * Transform API course to UI display format
   */
 // Update this function in src/services/course-service.ts

/**
 * Transform a course from API format to display format
 * Ensures enrollment status is preserved
 */
export function transformCourseForDisplay(course: Course): Course {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    dates: course.dates,
    time: course.time,
    duration: course.duration,
    mode: course.mode,
    location: course.location,
    instructor: course.instructor,
    maxCapacity: course.maxCapacity,
    currentEnrollment: course.currentEnrollment,
    availability: course.availability,
    price: course.price,
    level: course.level,
    category: course.category,
    prerequisites: course.prerequisites || [],
    certification: course.certification,
    language: course.language,
    isActive: course.isActive,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    enrollmentStatus: course.enrollmentStatus // Preserve enrollment status
  };
}
  
  /**
   * Get all categories
   */
  export async function getCategories(includeInactive: boolean = false): Promise<{ 
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      displayOrder: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }> 
  }> {
    const params = new URLSearchParams();
    
    if (includeInactive) {
      params.append('includeInactive', 'true');
    }
  
    const response = await fetch(`/api/training/categories?${params.toString()}`);
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch categories');
    }
  
    return response.json();
  }
  
  /**
   * Extract unique categories from a list of courses
   */
  export function extractUniqueCategories(courses: Course[]): string[] {
    return Array.from(new Set(courses.map(course => course.category)));
  }
  
  /**
   * Calculate course statistics
   */
  export function calculateCourseStatistics(courses: Course[]) {
    return {
      totalCourses: courses.length,
      onlineCourses: courses.filter(c => c.mode === 'online').length,
      hybridCourses: courses.filter(c => c.mode === 'hybrid').length,
      inPersonCourses: courses.filter(c => c.mode === 'in-person').length,
      beginnerCourses: courses.filter(c => c.level === 'beginner').length,
      intermediateCourses: courses.filter(c => c.level === 'intermediate').length,
      advancedCourses: courses.filter(c => c.level === 'advanced').length,
    };
  }
  
  /**
   * Get upcoming courses (sorted by nearest start date)
   */
  export function getUpcomingCourses(courses: Course[], limit: number = 3) {
    return [...courses]
      .sort((a, b) => {
        const dateA = new Date(a.dates.split(' - ')[0]);
        const dateB = new Date(b.dates.split(' - ')[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, limit);
  }