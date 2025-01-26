// src/app/dashboard/finance/settings/page.tsx
'use client';
import React from 'react';


const FinanceSettingsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Finance Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure financial settings, payment methods, and automation rules
        </p>
      </div>

      <FinanceSettings />
    </div>
  );
};

export default FinanceSettingsPage;
