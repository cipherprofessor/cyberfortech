// src/app/dashboard/finance/layout.tsx
'use client';
import React from 'react';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Add any finance-specific layout elements here */}
      {children}
    </div>
  );
}