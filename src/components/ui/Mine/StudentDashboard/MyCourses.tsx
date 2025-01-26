'use client' 
// src/components/ui/Mine/StudentDashboard/MyCourses.tsx
import React from 'react';

import { motion } from 'framer-motion';
import axios from 'axios';
import { HoverEffect } from '../../card-hover-effect';

interface Course {
  id: string;
  title: string;
  progress: number;
  totalHours: number;
  completedHours: number;
  thumbnail: string;
}

export const MyCourses = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    // Fetch courses data from your API
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/student/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      <HoverEffect items={courses.map(course => ({
        title: course.title,
        description: `Progress: ${course.progress}% | ${course.completedHours}/${course.totalHours}h`,
        link: `/course/${course.id}`,
        image: course.thumbnail
      }))} />
    </div>
  );
};