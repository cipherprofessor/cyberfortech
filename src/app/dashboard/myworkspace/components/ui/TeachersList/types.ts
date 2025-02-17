// types/teacher.ts

  
  export interface TeacherDisplay {
    id: string;
    name: string;
    email: string;
    avatar: string;
    qualification: string;
    subject: {
      name: string;
      color: string;
    };
  }

  // types.ts
export interface Teacher {
    id: string;
    name: string;
    email: string;
    avatar: string;
    qualification: string;
    subject: {
      name: string;
      color: string;
    };
  }
  
  export interface TeacherAPI {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    description: string | null;
    contact_number: string | null;
    address: string | null;
    profile_image_url: string | null;
    specialization: string | null;
    qualification: string | null;
    years_of_experience: number | null;
    rating: number;
    total_students: number;
    total_courses: number;
    social_links: string | null;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
  }
  
  export interface TeacherFormData {
    id?: string;
    name: string;
    email: string;
    bio: string;
    // description: string;
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



// This is the type used in the UI components


// Props types
export interface TeachersListProps {
    data: Teacher[];
    title?: string;
    className?: string;
    onViewAll?: () => void;
    itemsPerPage?: number;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onSearch?: (term: string) => void;
    onTeacherClick?: (teacher: Teacher) => void;
    onEdit?: (teacher: Teacher) => void;         // Changed from onTeacherUpdate
    onDelete?: (teacher: Teacher) => void; 
    onCreateClick?: () => void;      // Changed from onTeacherDelete
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher | null;
}

export interface EditModalProps extends ModalProps {
    onSave: (teacher: Teacher) => void;
}

export interface DeleteModalProps extends ModalProps {
    onConfirm: () => void;
}



export const subjectColors: Record<string, string> = {
    'Full Stack Development': '#818cf8',
    'English': '#a78bfa',
    'Physics': '#ef4444',
    'Mathematics': '#10b981',
    'Chemistry': '#f59e0b',
    'Biology': '#3b82f6'
  };
