// src/components/trainingcalender/EnrollmentModal/types.ts

// Interface for training course data
export interface TrainingCourse {
    id: string;
    title: string;
    dates: string;
    time: string;
    duration: string;
    mode: 'online' | 'in-person' | 'hybrid';
    location?: string;
    instructor: string;
    availability: number;
    price: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    description: string;
    prerequisites?: string[];
    certification?: string;
    language: string;
  }
  
  // Interface for enrollment form data
  export interface EnrollmentFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    paymentMethod: 'credit_card' | 'invoice' | 'bank_transfer';
    comments: string;
    agreeTerms: boolean;
    courseId: string;
  }
  
  // Enum for enrollment steps
  export enum EnrollmentStep {
    DETAILS = 'details',
    FORM = 'form',
    CONFIRMATION = 'confirmation'
  }
  
  // Type for form validation errors
  export type FormErrors = Partial<Record<keyof EnrollmentFormData, string>>;