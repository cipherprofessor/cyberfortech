'use client';
import { CourseManagement } from '@/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseManagement';

const SuperAdminCourseManagementPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create, manage, and monitor all courses
        </p>
      </div>
      
      <CourseManagement />
    </div>
  );
};

export default SuperAdminCourseManagementPage;