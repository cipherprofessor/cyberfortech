'use client';
// src/components/ui/Mine/CommunicationsDashboard/MessagesDashboard.tsx

import React, { useState } from 'react';
import { DonutChart } from '@/components/charts/Re-charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/Re-charts/composite/AnalyticsDashboardChart';
import {
  IconMessage,
  IconUsers,
  IconMailOpened,
  IconClock,
  IconSearch,
  IconFilter,
  IconTrash,
  IconEdit,
  IconEye,
  IconSend,
  IconArchive,
  IconMail,
  IconMailForward,
  IconDownload,
  IconUserCircle,
  IconDots
} from '@tabler/icons-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  recipients: {
    total: number;
    read: number;
    clicked: number;
  };
  sentAt: string;
  status: 'sent' | 'draft' | 'scheduled';
  category: 'announcement' | 'notification' | 'update' | 'other';
  priority: 'high' | 'medium' | 'low';
  deliveryStatus: {
    delivered: number;
    failed: number;
    pending: number;
  };
}

interface MessagesMetrics {
  totalMessages: number;
  totalRecipients: number;
  averageOpenRate: number;
  averageClickRate: number;
  messagesByCategory: { category: string; count: number; }[];
  deliveryTrends: { date: string; delivered: number; opened: number; clicked: number; }[];
}

const MessagesDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Sample messages data
  const messages: Message[] = [
    {
      id: '1',
      subject: 'New Course Release Notification',
      content: 'We are excited to announce the release of our new course...',
      sender: {
        id: '1',
        name: 'Arsalan Rayees',
        role: 'admin'
      },
      recipients: {
        total: 1500,
        read: 1200,
        clicked: 800
      },
      sentAt: '2024-01-25T10:30:00',
      status: 'sent',
      category: 'notification',
      priority: 'high',
      deliveryStatus: {
        delivered: 1450,
        failed: 50,
        pending: 0
      }
    },
    // Add more messages...
  ];

  // Metrics calculation
  const metrics: MessagesMetrics = {
    totalMessages: messages.length,
    totalRecipients: messages.reduce((acc, m) => acc + m.recipients.total, 0),
    averageOpenRate: messages.reduce((acc, m) => 
      acc + (m.recipients.read / m.recipients.total), 0) / messages.length * 100,
    averageClickRate: messages.reduce((acc, m) => 
      acc + (m.recipients.clicked / m.recipients.total), 0) / messages.length * 100,
    messagesByCategory: [
      { category: 'Notifications', count: 45 },
      { category: 'Updates', count: 30 },
      { category: 'Announcements', count: 25 },
      { category: 'Other', count: 10 }
    ],
    deliveryTrends: [
      { 
        date: '2024-01', 
        delivered: 1500,
        opened: 1200,
        clicked: 800
      },
      // Add more trend data...
    ]
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Messages</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.totalMessages.toLocaleString()}
              </h3>
              <div className="text-sm text-green-600">
                +12.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconMessage className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Recipients</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.totalRecipients.toLocaleString()}
              </h3>
              <div className="text-sm text-green-600">
                +8.2% vs last month
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <IconUsers className="h-6 w-6 text-green-600 dark:text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Open Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.averageOpenRate.toFixed(1)}%
              </h3>
              <div className="text-sm text-green-600">
                +5.3% vs last month
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <IconMailOpened className="h-6 w-6 text-purple-600 dark:text-purple-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Click Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.averageClickRate.toFixed(1)}%
              </h3>
              <div className="text-sm text-green-600">
                +3.8% vs last month
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <IconClock className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Message Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <EnhancedAnalyticsDashboardChart
            data={metrics.deliveryTrends}
            series={[
              {
                type: 'line',
                dataKey: 'delivered',
                name: 'Delivered',
                color: '#3B82F6',
                curveType: 'monotone'
              },
              {
                type: 'line',
                dataKey: 'opened',
                name: 'Opened',
                color: '#10B981',
                curveType: 'monotone'
              },
              {
                type: 'line',
                dataKey: 'clicked',
                name: 'Clicked',
                color: '#F59E0B',
                curveType: 'monotone'
              }
            ]}
            xAxisKey="date"
            height={300}
            title="Message Performance"
            subtitle="Track delivery, open, and click rates"
          />
        </div>

        {/* Message Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Message Categories</h3>
          <div className="h-[300px]">
            <DonutChart
              data={metrics.messagesByCategory.map(cat => ({
                name: cat.category,
                value: cat.count,
                color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][
                  metrics.messagesByCategory.indexOf(cat) % 4
                ]
              }))}
              height={300}
              centerText={{
                primary: metrics.totalMessages.toString(),
                secondary: 'Total Messages'
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="notification">Notifications</option>
                <option value="announcement">Announcements</option>
                <option value="update">Updates</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowComposeModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <IconMail className="h-4 w-4 mr-2" />
                Compose
              </button>

              <button
                onClick={() => {/* Export functionality */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
                title="Export Messages"
              >
                <IconDownload className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {messages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                        flex items-center justify-center">
                        <IconUserCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {message.subject}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        From: {message.sender.name} • {new Date(message.sentAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full
                      ${message.status === 'sent'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : message.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600// Continuation of MessagesDashboard.tsx

dark:text-gray-300 line-clamp-2 mb-4">
                    {message.content}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <IconUsers className="h-4 w-4 mr-1" />
                      {message.recipients.total.toLocaleString()} recipients
                    </div>
                    <div className="flex items-center">
                      <IconMailOpened className="h-4 w-4 mr-1" />
                      {((message.recipients.read / message.recipients.total) * 100).toFixed(1)}% opened
                    </div>
                    <div className="flex items-center">
                      <IconMailForward className="h-4 w-4 mr-1" />
                      {((message.recipients.clicked / message.recipients.total) * 100).toFixed(1)}% clicked
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full
                      ${message.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : message.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)} Priority
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 
                      dark:bg-blue-900 dark:text-blue-200"
                    >
                      {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => {/* View message details */}}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                      dark:hover:bg-gray-700 rounded-lg"
                    title="View Details"
                  >
                    <IconEye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Edit message */}}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                      dark:hover:bg-gray-700 rounded-lg"
                    title="Edit Message"
                  >
                    <IconEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Archive message */}}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                      dark:hover:bg-gray-700 rounded-lg"
                    title="Archive Message"
                  >
                    <IconArchive className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Delete message */}}
                    className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 
                      dark:hover:bg-red-900 rounded-lg"
                    title="Delete Message"
                  >
                    <IconTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <IconMessage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No messages found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by composing a new message.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowComposeModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 mx-auto"
                >
                  <IconMail className="h-4 w-4 mr-2" />
                  Compose Message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {messages.length} messages
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesDashboard;