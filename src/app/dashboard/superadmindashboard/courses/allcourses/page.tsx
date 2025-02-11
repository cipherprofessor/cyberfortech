// src/app/dashboard/superadmindashboard/courses/allcourses/page.tsx
'use client';

import SuperAdminCourseDashboard from '@/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CoursesDashboard/CoursesDashboard';
import React from 'react';

const AllCoursesPage = () => {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create, manage, and monitor all courses and their performance
        </p>
      </div>

      {/* Main Dashboard Component */}
      <SuperAdminCourseDashboard 
        isOpen={false} 
        onClose={() => {}} 
        onSubmit={() => {}}
      />
    </div>
  );
};

export default AllCoursesPage;