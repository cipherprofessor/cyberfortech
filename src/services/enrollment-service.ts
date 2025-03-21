// src/services/enrollment-service.ts

/**
 * Service for handling all enrollment-related API calls
 */
export interface EnrollmentFormData {
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  courseId: string;
}

export interface EnrollmentRequestData {
  paymentId?: string;
  paymentAmount?: number;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export interface EnrollmentResponse {
  id: string;
  courseId: string;
  userId: string;
  status: string;
  paymentStatus: string;
  paymentId?: string;
  paymentAmount?: number;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentDetailResponse extends EnrollmentResponse {
  completionDate?: string;
  feedback?: string;
  rating?: number;
  certificateId?: string;
  courseTitle: string;
  courseDates: string;
  courseTime: string;
  courseInstructor: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface UserEnrollmentsResponse {
  enrollments: Array<{
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
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EnrollmentData {
  courseId: string;
  paymentId?: string;
  paymentMethod?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  metadata?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    comments?: string;
  };
}

/**
 * Enroll a user in a course
 */
export async function enrollInCourse(
  courseId: string, 
  data: EnrollmentData
): Promise<EnrollmentResponse> {
  // Prepare the request body - properly handle metadata by converting to string
  const requestBody = {
    paymentId: data.paymentId,
    status: data.status || 'pending',
    paymentStatus: data.paymentStatus || 'pending',
    metadata: data.metadata ? JSON.stringify(data.metadata) : undefined
  };

  const response = await fetch(`/api/training/courses/${courseId}/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to enroll in course');
  }

  return response.json();
}

/**
 * Get all enrollments for the current user
 */
export async function getUserEnrollments(
  page: number = 1, 
  limit: number = 10,
  status?: string
): Promise<UserEnrollmentsResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (status) {
    params.append('status', status);
  }

  const response = await fetch(`/api/training/user/enrollments?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch enrollments');
  }

  return response.json();
}

// Add this optimized function to your enrollment-service.ts file

/**
 * Check if user is enrolled in specific courses - optimized version
 * Uses a more efficient approach by checking all courses at once
 * @param courseIds Array of course IDs to check
 * @returns Map of courseId to enrollment status
 */
export async function checkUserEnrollments(
  courseIds: string[]
): Promise<Map<string, string>> {
  try {
    // If no course IDs provided, return empty map
    if (!courseIds.length) return new Map();
    
    // Cache map to avoid redundant API calls
    const enrollmentsMap = new Map<string, string>();
    
    // Get unique course IDs
    const uniqueCourseIds = [...new Set(courseIds)];
    
    const response = await fetch(
      `/api/training/user/enrolled-courses?courseIds=${uniqueCourseIds.join(',')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache: 'no-store' to prevent caching and ensure fresh data
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to check course enrollments');
    }
    
    const data = await response.json();
    
    // Convert the object to a Map
    if (data.enrollments && typeof data.enrollments === 'object') {
      Object.keys(data.enrollments).forEach(courseId => {
        enrollmentsMap.set(courseId, data.enrollments[courseId]);
      });
    }
    
    return enrollmentsMap;
  } catch (error) {
    console.error('Error checking course enrollments:', error);
    return new Map();
  }
}

/**
 * Check if user is enrolled in a specific course
 * @param courseId The course ID to check
 * @returns Boolean indicating if user is enrolled
 */
export async function isUserEnrolledInCourse(courseId: string): Promise<boolean> {
  try {
    const enrollmentsMap = await checkUserEnrollments([courseId]);
    return enrollmentsMap.has(courseId);
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
}

/**
 * Get user enrollments by course IDs
 * @param courseIds Array of course IDs to check
 * @returns Map of courseId to enrollment status
 */
export async function getUserEnrollmentsByCourseIds(
  courseIds: string[]
): Promise<Map<string, string>> {
  return await checkUserEnrollments(courseIds);
}

/**
 * Get a specific enrollment by ID
 */
export async function getEnrollment(enrollmentId: string): Promise<EnrollmentDetailResponse> {
  const response = await fetch(`/api/training/enrollments/${enrollmentId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch enrollment');
  }

  return response.json();
}

/**
 * Update an enrollment (can be used for providing feedback or rating)
 */
export async function updateEnrollment(
  enrollmentId: string, 
  data: {
    feedback?: string;
    rating?: number;
    status?: string;
    paymentStatus?: string;
  }
): Promise<EnrollmentResponse> {
  const response = await fetch(`/api/training/enrollments/${enrollmentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update enrollment');
  }

  return response.json();
}

/**
 * Cancel an enrollment
 */
export async function cancelEnrollment(enrollmentId: string): Promise<{ message: string }> {
  const response = await fetch(`/api/training/enrollments/${enrollmentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to cancel enrollment');
  }

  return response.json();
}

/**
 * Get all enrollments for a specific course (admin only)
 */
export async function getCourseEnrollments(
  courseId: string,
  page: number = 1, 
  limit: number = 20
): Promise<{
  enrollments: EnrollmentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(`/api/training/courses/${courseId}/enrollments?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch course enrollments');
  }

  return response.json();
}

/**
 * Join a course waitlist
 */
export async function joinWaitlist(courseId: string): Promise<{
  id: string;
  courseId: string;
  userId: string;
  status: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}> {
  const response = await fetch(`/api/training/courses/${courseId}/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to join waitlist');
  }

  return response.json();
}

/**
 * Leave a waitlist
 */
export async function leaveWaitlist(waitlistId: string): Promise<{ message: string }> {
  const response = await fetch(`/api/training/waitlist/${waitlistId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to leave waitlist');
  }

  return response.json();
}