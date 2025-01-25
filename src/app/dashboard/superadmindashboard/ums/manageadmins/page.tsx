// src/app/dashboard/users/admins/page.tsx
'use client';

import ManageAdmins from '@/components/ui/Mine/SuperadminDashboard/UMS/ManageAdmins';
import React from 'react';


const ManageAdminsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage admin accounts, permissions, and monitor admin activities
        </p>
      </div>

      <ManageAdmins />
    </div>
  );
};

export default ManageAdminsPage;