// src/app/dashboard/finance/reports/page.tsx
'use client';
import { ReportGenerator } from '@/components/ui/Mine/SuperadminDashboard/FinanceDashboard/ReportGenerator';
import React from 'react';


const FinancialReportsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Financial Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate comprehensive financial reports and analytics
        </p>
      </div>

      <ReportGenerator />
    </div>
  );
};

export default FinancialReportsPage;