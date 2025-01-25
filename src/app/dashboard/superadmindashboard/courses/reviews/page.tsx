// src/app/dashboard/courses/reviews/page.tsx
'use client';

import CourseReviews from '@/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseReviews';
import React from 'react';


const CourseReviewsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course Reviews
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and monitor course reviews and ratings
        </p>
      </div>

      <CourseReviews />
    </div>
  );
};

export default CourseReviewsPage;