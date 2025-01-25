"use client"

import ManageStudentsDashboard from '@/components/ui/Mine/SuperadminDashboard/UMS/ManageStudents';
import React from 'react';


const ManageStudentsDashboardPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor student progress, course engagement, and learning activities
        </p>
      </div>

      <ManageStudentsDashboard />
    </div>
  );
};

export default ManageStudentsDashboardPage;