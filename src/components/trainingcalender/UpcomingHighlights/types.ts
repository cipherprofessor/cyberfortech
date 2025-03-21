// Create a types.ts file in your UpcomingHighlights directory
// src/components/trainingcalender/UpcomingHighlights/types.ts

// Define the extended TrainingCourse interface with enrollmentStatus
export interface TrainingCourseWithEnrollment {
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
    enrollmentStatus?: string; // Explicitly adding enrollmentStatus
  }