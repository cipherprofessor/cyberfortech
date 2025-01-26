// src/app/dashboard/finance/tax/page.tsx
'use client';
import React from 'react';


const TaxManagementPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tax Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure tax rates, manage tax rules, and generate tax reports
        </p>
      </div>

      <TaxManager />
    </div>
  );
};

export default TaxManagementPage;