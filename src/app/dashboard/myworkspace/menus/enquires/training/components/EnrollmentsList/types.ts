// src/app/dashboard/myworkspace/menus/enquires/training/components/EnrollmentsList/types.ts

// Author/Student information
export interface EnrollmentAuthor {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  }
  
  // Course information
  export interface EnrollmentCourse {
    id: string;
    title: string;
    description: string;
    dates: string;
    time: string;
    duration: string;
    mode: 'online' | 'in-person' | 'hybrid';
    location?: string;
    instructor: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    price: number;
    certification?: string;
  }
  
  // Enrollment data structure
  export interface Enrollment {
    id: string;
    courseId: string;
    userId: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paymentId?: string;
    paymentAmount?: number;
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
    author?: EnrollmentAuthor;
    formData?: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      company: string;
      comments: string;
    };
  }
  
  // Pagination data structure
  export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  
  // API response structure
  export interface EnrollmentsResponse {
    enrollments: Enrollment[];
    pagination: PaginationInfo;
  }
  
  // Filter options
  export interface EnrollmentFilters {
    courseId?: string;
    status?: string;
    search?: string;
  }