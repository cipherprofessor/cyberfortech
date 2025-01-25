// src/app/dashboard/analytics/users/page.tsx
'use client';

import UserGrowthDashboard from '@/components/ui/Mine/Analytics/UserGrowthDashboard';
import React from 'react';


const UserGrowthPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Growth Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor user acquisition, engagement, and retention metrics
        </p>
      </div>

      <UserGrowthDashboard />
    </div>
  );
};

export default UserGrowthPage;