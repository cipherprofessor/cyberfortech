// src/components/ui/Mine/SuperadminDashboard/Overview.tsx
'use client';
import React from 'react';

export function OverviewComponent() {
  return (
    <div className="w-full min-h-full">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Card 1</h2>
            {/* Card content */}
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Card 2</h2>
            {/* Card content */}
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Card 3</h2>
            {/* Card content */}
          </div>
        </div>
      </div>
    </div>
  );
}