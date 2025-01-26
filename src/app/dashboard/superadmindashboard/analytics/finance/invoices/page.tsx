// src/app/dashboard/finance/invoices/page.tsx
'use client';
import InvoiceGenerator from '@/components/ui/Mine/SuperadminDashboard/FinanceDashboard/InvoiceGenerator';
import React from 'react';


const InvoicesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Invoice Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate, customize, and manage invoices for your customers
        </p>
      </div>

      <InvoiceGenerator />
    </div>
  );
};

export default InvoicesPage;
