// types/teacher.ts
export interface Teacher {
    id: string;
    name: string;
    email: string;
    bio?: string;
    contact_number?: string;
    address?: string;
    profile_image_url: string;
    specialization: string;
    qualification: string;
    years_of_experience: number;
    rating?: number;
    total_students?: number;
    total_courses?: number;
    social_links?: Record<string, string>;
    status: string;
    created_at?: string;
    updated_at?: string;
  }
  
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


  export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  qualification: string;
  subject: {
    name: string;
    color: string;
  };
}

export interface TeachersListProps {
  data: Teacher[];
  title?: string;
  className?: string;
  onViewAll?: () => void;
  itemsPerPage?: number;
  onTeacherUpdate?: (teacher: Teacher) => void;
  onTeacherDelete?: (teacherId: string) => void;
}


export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher | null;
  }
  