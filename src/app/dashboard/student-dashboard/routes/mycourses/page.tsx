// src/app/dashboard/finance/page.tsx
'use client';

import { MyCourses } from '@/components/ui/Mine/StudentDashboard/MyCourses';
import FinanceOverview from '@/components/ui/Mine/SuperadminDashboard/FinanceDashboard/FinanceOverview';
import React from 'react';


const FinanceOverviewPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Financial Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor revenue, expenses, and overall financial performance
        </p>
      </div>

      <MyCourses/>
    </div>
  );
};

export default FinanceOverviewPage;