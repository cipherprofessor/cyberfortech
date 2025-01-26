// src/app/dashboard/finance/reports/page.tsx
'use client';
import { ReportGenerator } from '@/components/ui/Mine/SuperadminDashboard/FinanceDashboard/ReportGenerator';
import TransactionsDashboard from '@/components/ui/Mine/SuperadminDashboard/FinanceDashboard/TransactionsDashboard';
import React from 'react';


const FinancialReportsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transaction Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage all transactions
        </p>
      </div>

      <TransactionsDashboard />
    </div>
  );
};

export default FinancialReportsPage;