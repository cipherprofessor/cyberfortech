// src/services/user-enrollment-service.ts

/**
 * Interface for user enrollment response
 */
export interface UserEnrollment {
    id: string;
    courseId: string;
    status: string;
    paymentStatus: string;
    enrollmentDate: string;
    completionDate?: string;
    feedback?: string;
    rating?: number;
    courseTitle: string;
    courseDescription: string;
    courseDates: string;
    courseTime: string;
    courseDuration: string;
    courseMode: string;
    courseInstructor: string;
    courseLevel: string;
    courseCategory: string;
  }
  
  /**
   * Interface for user enrollments response
   */
  export interface UserEnrollmentsResponse {
    enrollments: UserEnrollment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  /**
   * Get enrollments for the current user
   * @param page Page number
   * @param limit Items per page
   * @param status Filter by enrollment status
   */
  export const getUserEnrollments = async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<UserEnrollmentsResponse> => {
    try {
      let url = `/api/training/user/enrollments?page=${page}&limit=${limit}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user enrollments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      throw error;
    }
  };
  
  /**
   * Check if user is enrolled in specific courses
   * @param courseIds Array of course IDs to check
   * @returns Map of courseId to enrollment status
   */
  export const checkUserEnrollments = async (
    courseIds: string[]
  ): Promise<Map<string, string>> => {
    try {
      // If no course IDs provided, return empty map
      if (!courseIds.length) return new Map();
      
      const response = await fetch(
        `/api/training/user/enrolled-courses?courseIds=${courseIds.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check course enrollments');
      }
      
      const data = await response.json();
      const enrollmentsMap = new Map<string, string>();
      
      // Convert the object to a Map
      Object.keys(data.enrollments).forEach(courseId => {
        enrollmentsMap.set(courseId, data.enrollments[courseId]);
      });
      
      return enrollmentsMap;
    } catch (error) {
      console.error('Error checking course enrollments:', error);
      return new Map();
    }
  };
  
  /**
   * Check if user is enrolled in a specific course
   * @param courseId The course ID to check
   * @returns Boolean indicating if user is enrolled
   */
  export const isUserEnrolledInCourse = async (courseId: string): Promise<boolean> => {
    try {
      const enrollmentsMap = await checkUserEnrollments([courseId]);
      return enrollmentsMap.has(courseId);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }
  };
  
  /**
   * Get user enrollments by course IDs
   * @param courseIds Array of course IDs to check
   * @returns Map of courseId to enrollment status
   */
  export const getUserEnrollmentsByCourseIds = async (
    courseIds: string[]
  ): Promise<Map<string, string>> => {
    return await checkUserEnrollments(courseIds);
  };