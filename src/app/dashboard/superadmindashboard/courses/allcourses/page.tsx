// app/dashboard/courses/page.tsx
'use client';

import React from 'react';


import CourseManagement, { Course11 } from '@/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CoursesDashboard/SuperAdminCourseDashboard';

// Mock data for courses
const mockCourses: Course11[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch. Cover HTML, CSS, JavaScript, React, Node.js, and more.',
    instructor: 'Arsalan Rayees',
    createdBy: 'arsalan@example.com',
    category: 'Web Development',
    level: 'beginner',
    duration: 2880, // 48 hours
    enrollments: 1250,
    completionRate: 85,
    averageRating: 4.8,
    totalWatchTime: 156000, // in minutes
    revenue: 62500,
    status: 'published',
    lastUpdated: '2024-02-10',
    thumbnail: '/thumbnails/web-dev.jpg',
    sections: 12,
    lessons: 148
  },
  {
    id: '2',
    title: 'Data Science and Machine Learning',
    description: 'Master data science, machine learning, and AI with Python. Includes practical projects and real-world datasets.',
    instructor: 'Jane Smith',
    createdBy: 'jane@example.com',
    category: 'Data Science',
    level: 'intermediate',
    duration: 3600, // 60 hours
    enrollments: 980,
    completionRate: 78,
    averageRating: 4.7,
    totalWatchTime: 142000,
    revenue: 49000,
    status: 'published',
    lastUpdated: '2024-02-08',
    thumbnail: '/thumbnails/data-science.jpg',
    sections: 15,
    lessons: 185
  },
  {
    id: '3',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Deploy to both iOS and Android.',
    instructor: 'Mike Johnson',
    createdBy: 'mike@example.com',
    category: 'Mobile Development',
    level: 'intermediate',
    duration: 2400, // 40 hours
    enrollments: 750,
    completionRate: 82,
    averageRating: 4.6,
    totalWatchTime: 98000,
    revenue: 37500,
    status: 'published',
    lastUpdated: '2024-02-05',
    thumbnail: '/thumbnails/react-native.jpg',
    sections: 10,
    lessons: 120
  },
  {
    id: '4',
    title: 'UI/UX Design Masterclass',
    description: 'Learn modern UI/UX design principles, tools, and workflows. Create stunning user interfaces and experiences.',
    instructor: 'Sarah Wilson',
    createdBy: 'sarah@example.com',
    category: 'UI/UX Design',
    level: 'beginner',
    duration: 1800, // 30 hours
    enrollments: 620,
    completionRate: 90,
    averageRating: 4.9,
    totalWatchTime: 85000,
    revenue: 31000,
    status: 'published',
    lastUpdated: '2024-02-01',
    thumbnail: '/thumbnails/uiux-design.jpg',
    sections: 8,
    lessons: 95
  },
  {
    id: '5',
    title: 'Advanced JavaScript Patterns',
    description: 'Deep dive into advanced JavaScript concepts, design patterns, and best practices for senior developers.',
    instructor: 'Arsalan Rayees',
    createdBy: 'arsalan@example.com',
    category: 'Web Development',
    level: 'advanced',
    duration: 1200, // 20 hours
    enrollments: 450,
    completionRate: 75,
    averageRating: 4.7,
    totalWatchTime: 45000,
    revenue: 22500,
    status: 'draft',
    lastUpdated: '2024-01-28',
    thumbnail: '/thumbnails/advanced-js.jpg',
    sections: 6,
    lessons: 72
  },
  {
    id: '6',
    title: 'DevOps and Cloud Engineering',
    description: 'Master DevOps practices and cloud platforms. Learn AWS, Docker, Kubernetes, and CI/CD pipelines.',
    instructor: 'Mike Johnson',
    createdBy: 'mike@example.com',
    category: 'DevOps',
    level: 'advanced',
    duration: 3000, // 50 hours
    enrollments: 380,
    completionRate: 70,
    averageRating: 4.5,
    totalWatchTime: 68000,
    revenue: 19000,
    status: 'published',
    lastUpdated: '2024-01-25',
    thumbnail: '/thumbnails/devops.jpg',
    sections: 14,
    lessons: 168
  }
];

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your courses, track performance, and analyze student engagement
        </p>
      </div>
      
      <CourseManagement courses={mockCourses} />
    </div>
  );
}