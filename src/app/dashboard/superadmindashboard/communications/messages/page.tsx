// src/app/dashboard/communications/messages/page.tsx
'use client';

import MessagesDashboard from '@/components/ui/Mine/SuperadminDashboard/CommunicationsDashboard/MessagesDashboard';
import React from 'react';


const MessagesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and monitor all communication messages, track engagement metrics, and send new messages
        </p>
      </div>

      <MessagesDashboard />
    </div>
  );
};

export default MessagesPage;