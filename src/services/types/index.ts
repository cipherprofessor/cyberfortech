// export interface Course {
//     id: string;
//     title: string;
//     description: string;
//     imageUrl: string;
//     price: number;
//     duration: string;
//     level: string;
//     category: string;
//     instructorId: string;
//     instructorName: string;
//     instructorAvatar: string;
//     totalStudents: number;
//     averageRating: number;
//     totalReviews: number;
//     createdAt: string;
//     updatedAt: string;
//     sections?: CourseSection[];
//   }
  
//   export interface CourseSection {
//     id: string;
//     courseId: string;
//     title: string;
//     orderIndex: number;
//     lessons: CourseLesson[];
//   }
  
//   export interface CourseLesson {
//     id: string;
//     sectionId: string;
//     title: string;
//     content?: string;
//     videoUrl?: string;
//     duration: string;
//     orderIndex: number;
//   }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    createdAt: string;
  }
  
  export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    status: 'active' | 'completed' | 'cancelled';
    progress: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Review {
    id: string;
    userId: string;
    courseId: string;
    rating: number;
    content: string;
    createdAt: string;
  }