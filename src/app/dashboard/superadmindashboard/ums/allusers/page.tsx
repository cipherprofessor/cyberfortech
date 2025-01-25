// src/app/dashboard/users/all/page.tsx
'use client';

import UsersDashboard from '@/components/ui/Mine/SuperadminDashboard/UMS/UsersDashboard';
import React from 'react';
// import UsersDashboard from '@/components/ui/Mine/UsersDashboard/UsersDashboard';

const AllUsersPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage all users, track metrics, and perform bulk actions
        </p>
      </div>

      <UsersDashboard />
    </div>
  );
};

export default AllUsersPage;