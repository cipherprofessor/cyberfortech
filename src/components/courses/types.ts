// src/types/courses.ts

/**
 * Core Types
 */

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Course {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  duration?: string;
  level?: string;
  category?: string;
  instructor_id?: string;
  instructor_name?: string;
  instructor_profile_image_url?: string;
  image_url?: string;
  total_students?: number;
  total_reviews?: number;
  average_rating?: number;
  created_at?: string;
  updated_at?: string;
  
  // Alternative field names for compatibility
  instructor_avatar?: string;
  enrollment_count?: number;
  ratings?: number;
  createdAt?: string;
  courseId?: string;
  
  // Content-related fields
  sections?: any[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked?: boolean;
  description?: string;
  videoUrl?: string;
  order_index?: number;
  is_free?: boolean;
  isFreePreview?: boolean;
  contentType?: string;
  resource_type?: string;
  resource_url?: string;
  is_complete?: boolean;
  progress?: string;
  sequenceNumber?: number;
  content?: {
    videoUrl: string | null;
    articleContent: string | null;
    quizData: any | null;
    assignmentDetails: any | null;
  };
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order_index?: number;
  sequence_number?: number;
}

/**
 * Component Props
 */

export interface CourseCardProps {
  course: Course;
  priorityLoad?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string, courseName: string) => void;
  isManagementView?: boolean;
}

export interface CourseHeaderProps {
  course: Course;
}

export interface CourseContentProps {
  courseId: string;
  courseContentData: any;
  course?: Course;
  className?: string;
  onLessonClick?: (lessonId: string) => void;
  onSectionToggle?: (sectionId: string) => void;
  initialExpandedSections?: string[];
  showDuration?: boolean;
  variant?: 'default' | 'compact';
  theme?: 'light' | 'dark' | 'auto';
}

export interface CourseDetailProps {
  courseId: string;
}

export interface CourseSidebarProps {
  course: Course;
  courseContent?: any;
  courseContentData?: any;
  className?: string;
  onEnroll?: (courseId: string) => Promise<void>;
  onWishlist?: (courseId: string) => Promise<void>;
  onShare?: (courseId: string) => Promise<void>;
  customTheme?: {
    primary: string;
    secondary: string;
  };
}

export interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  course?: Course | null;
  loading?: boolean;
  onSubmit: (courseData: Partial<Course>) => Promise<void>;
}

export interface SectionItemProps {
  section: Section;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  showDuration: boolean;
  variant: 'default' | 'compact';
}

export interface LessonItemProps {
  lesson: Lesson;
  index: number;
  showDuration: boolean;
  onClick?: () => void;
}

export interface DeleteConfirmDialogProps {
  show: boolean;
  courseName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface StyleProps {
  $isDark: boolean;
  $customTheme?: CourseSidebarProps['customTheme'];
}

/**
 * API Response Types
 */

export interface CourseContentResponse {
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
  sections: {
    id: string;
    title: string;
    description: string;
    sequence_number: number;
    lessons: {
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
    }[];
  }[];
}

export interface CourseAnalytics {
  totalEnrollments: number;
  totalCompletions: number;
  averageWatchTime: number;
  totalRevenue: number;
  popularCategories: { category: string; count: number; }[];
  monthlyEnrollments: { month: string; count: number; }[];
  instructorPerformance: { instructor: string; students: number; rating: number; }[];
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  profile_image_url: string | null;
  specialization?: string;
  rating?: number;
  total_courses?: number;
  years_of_experience?: number;
}

/**
 * Filter Types
 */

export interface FilterState {
  sortBy: 'newest' | 'price' | 'rating' | 'duration';
  sortOrder: 'asc' | 'desc';
  priceRange: [number, number];
  selectedCategories: string[];
  selectedLevels: string[];
  durationRange: 'all' | 'short' | 'medium' | 'long';
  minRating: number;
  search: string;
  createdAt?: Date;
}

export interface CourseFilterProps {
  onFilterChange: (filters: FilterState) => void;
  courses: Course[];
}