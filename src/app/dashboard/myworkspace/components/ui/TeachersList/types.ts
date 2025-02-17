export interface Subject {
  name: string;
  color: string;
}

// API Response Type
export interface TeacherAPI {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  contact_number: string | null;
  address: string | null;
  profile_image_url: string | null;
  specialization: string | null;
  subject: {
    name: string;
    color: string;
  };
  qualification: string | null;
  rating: number;
  years_of_experience: number;
  total_courses: number;
  total_students: number;
  social_links: string | null; // JSON string
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  avatar: string;
}

// Frontend Display Type
export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  contact_number: string;
  address: string;
  qualification: string;
  rating: number;
  years_of_experience: number;
  total_courses: number;
  total_students: number;
  social_links: string | Record<string, string>;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  subject: {
    name: string;
    color: string;
  };
  specialization: string;
}

// Form Data Type
export interface TeacherFormData {
  id?: string;
  name: string;
  email: string;
  bio: string;
  contact_number: string;
  address: string;
  profile_image_url: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  status: 'active' | 'inactive' | 'suspended';
}

// Props Types
export interface TeachersListProps {
  data: Teacher[];
  title?: string;
  className?: string;
  itemsPerPage?: number;
  onViewAll?: () => void;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onCreateClick: () => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;

}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export interface TeacherFormProps {
  mode: 'create' | 'edit';
  initialData?: TeacherFormData | null;
  onClose: () => void;
  onSubmit: (data: TeacherFormData) => Promise<void>;
}

// Column Configuration Type
export interface ColumnConfig {
  label: string;
  default: boolean;
}

export interface SocialLinksData {
  linkedin?: string;
  twitter?: string;
  website?: string;
  [key: string]: string | undefined;
}

// Statistics Types
export interface TeacherStats {
  rating: number;
  total_courses: number;
  total_students: number;
}

// Additional Helper Types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: keyof Teacher;
  direction: SortDirection;
}

export interface FilterConfig {
  status?: 'active' | 'inactive' | 'suspended';
  specialization?: string;
  minRating?: number;
  minExperience?: number;
}

// Column Display Configuration
export const DEFAULT_COLUMNS: Record<string, ColumnConfig> = {
  instructor: { label: 'Instructor', default: true },
  specialization: { label: 'Specialization', default: true },
  bio: { label: 'Bio', default: true },
  contact: { label: 'Contact Number', default: true },
  rating: { label: 'Rating', default: true },
  total_courses: { label: 'Total Courses', default: true },
  total_students: { label: 'Total Students', default: true },
  social_links: { label: 'Social Links', default: true },
  qualification: { label: 'Qualification', default: false },
  address: { label: 'Address', default: false },
  years_of_experience: { label: 'Experience', default: false },
  status: { label: 'Status', default: false },
  created_at: { label: 'Created At', default: false },
  updated_at: { label: 'Updated At', default: false }
} as const;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Search and Filter Types
export interface SearchParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  status?: string;
  specialization?: string;
}