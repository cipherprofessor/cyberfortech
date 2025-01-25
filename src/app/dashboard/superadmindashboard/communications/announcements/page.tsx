// src/app/dashboard/communications/announcements/page.tsx
'use client';

import AnnouncementsDashboard from '@/components/ui/Mine/SuperadminDashboard/CommunicationsDashboard/AnnouncementsDashboard';
import React from 'react';


const AnnouncementsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create and manage announcements, schedule notifications, and track audience engagement
        </p>
      </div>

      <AnnouncementsDashboard />
    </div>
  );
};

export default AnnouncementsPage;