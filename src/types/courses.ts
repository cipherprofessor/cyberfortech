type Course = {
    createdAt?: string | number | Date;
    id: string;
    title: string;
    description: string;
    image_url: string;
    duration: string;
    level: string;
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

  };
  
  type FilterState = {
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


  type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    image_url: string; // Changed from imageUrl to match API
    duration: string;
    level: string;
    price: number;
    average_rating: number; // Changed from rating to match API
    enrollment_count?: number; // Changed from studentsEnrolled to match API
    instructor_name: string;
    category: string;
    total_students?: number;
    ratings?: number;
    instructor_profile_image_url: string | null;
  };
};

interface CourseHeaderProps {
  course: {
    title: string;
    description: string;
    // instructor_name?: string | undefined;
    instructor_avatar: string;
    level: string;
    duration: string;
    average_rating: number;
    total_reviews: number;
    total_students: number;
    instructor_name?: string ;
  };
}



  
  interface CourseFilterProps {
    onFilterChange?: (filters: FilterState) => void;
    courses?: Course[];
  }


  interface CourseLesson {
    id: string;
    title: string;
    duration: string;
    order_index: number;
  }

