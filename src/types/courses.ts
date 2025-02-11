// src/types/courses.ts

export type Section = {
    id: string;
    title: string;
    lessons: CourseLesson[];
    order_index: number;
};


export type Course = {
    createdAt?: string | number | Date;
    id: string;
    title: string;
    description: string;
    image_url: string;
    duration: string;
    // level: string;
    price: number;
    average_rating: number;
    enrollment_count?: number;
    category: string;
    instructor_avatar?: string;
    total_reviews?: number;
    created_at?: string;
    updated_at?: string;
    instructor_id?: string;
    total_students: number;
    ratings?: number;
    rating?: number;
    instructor_name: string | null;
    instructor_profile_image_url: string | null;
    sections: CourseSection[]; // Adding sections for course detail page
    level: 'beginner' | 'intermediate' | 'advanced';
};

export type CourseSection = {
    id: string;
    title: string;
    lessons: CourseLesson[];
    order_index: number;
};

export type FilterState = {
    priceRange: number[];
    selectedLevels: string[];
    selectedCategories: string[];
    durationRange: string;
    minRating: number;
    search: string;
    sortOrder?: 'asc' | 'desc';
    sortBy?: string;
    createdAt?: Date;
};

export type CourseCardProps = {
    course: {
        id: string;
        title: string;
        description: string;
        image_url: string;
        duration: string;
        level: string;
        price: number;
        average_rating: number;
        enrollment_count?: number;
        instructor_name: string;
        category: string;
        total_students?: number;
        ratings?: number;
        instructor_profile_image_url: string | null;
        sections: Section[];
    };
};

export interface CourseHeaderProps {
    course: {
        title: string;
        description: string;
        instructor_avatar: string;
        level: string;
        duration: string;
        average_rating: number;
        total_reviews: number;
        total_students: number;
        instructor_name?: string;
    };
}

export interface CourseFilterProps {
    onFilterChange?: (filters: FilterState) => void;
    courses?: Course[];
}

export interface CourseLesson {
    id: string;
    title: string;
    duration: string;
    order_index: number;
}

export interface CourseContentProps {
  course: {
    sections: Section[];
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

  export interface CourseAnalytics {
    totalEnrollments: number;
    totalCompletions: number;
    averageWatchTime: number;
    totalRevenue: number;
    popularCategories: { category: string; count: number; }[];
    monthlyEnrollments: { month: string; count: number; }[];
    instructorPerformance: { instructor: string; students: number; rating: number; }[];
  }