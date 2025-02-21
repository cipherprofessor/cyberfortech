// types/courses.ts

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked?: boolean;
  description?: string;
  videoUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  sections: Section[];
}

export interface CourseContentProps {
  course: Course;
  className?: string;
  onLessonClick?: (lessonId: string) => void;
  onSectionToggle?: (sectionId: string) => void;
  initialExpandedSections?: string[];
  showDuration?: boolean;
  variant?: 'default' | 'compact';
  theme?: 'light' | 'dark' | 'auto';
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


/// Course Sidebar

// src/components/courses/CourseSidebar/types.ts

export interface Course {
  id: string;
  price: number;
  total_students: number;
  duration: string;
  level: CourseLevel;
  image_url: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface CourseSidebarProps {
  course: Course;
  className?: string;
  onEnroll?: (courseId: string) => Promise<void>;
  onWishlist?: (courseId: string) => Promise<void>;
  onShare?: (courseId: string) => Promise<void>;
  customTheme?: {
    primary: string;
    secondary: string;
  };
}

export interface StyleProps {
  $isDark: boolean;
  $customTheme?: CourseSidebarProps['customTheme'];
}