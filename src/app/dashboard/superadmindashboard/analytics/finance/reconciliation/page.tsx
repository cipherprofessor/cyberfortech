// src/app/dashboard/finance/reconciliation/page.tsx
'use client';
import React from 'react';


const ReconciliationPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Reconciliation
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Reconcile payments, match transactions, and review financial records
        </p>
      </div>

      <PaymentReconciliation />
    </div>
  );
};

export default ReconciliationPage;