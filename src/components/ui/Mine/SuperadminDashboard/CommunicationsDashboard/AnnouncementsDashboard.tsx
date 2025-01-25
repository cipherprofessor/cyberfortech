'use client';
// src/components/ui/Mine/CommunicationsDashboard/AnnouncementsDashboard.tsx

import React, { useState } from 'react';
import { DonutChart } from '@/components/charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/composite/AnalyticsDashboardChart';
import {
  IconBellRinging,
  IconUsers,
  IconEye,
  IconClock,
  IconSearch,
  IconFilter,
  IconTrash,
  IconEdit,
  IconPlus,
  IconDownload,
  IconBell,
  IconPencil,
  IconCalendarTime,
  IconUserCircle,
  IconDeviceMobile,
  IconWorld,
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'course' | 'event' | 'update';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  priority: 'high' | 'medium' | 'low';
  audience: {
    total: number;
    groups: string[];
    roles: string[];
  };
  metrics: {
    views: number;
    engagements: number;
    dismissals: number;
  };
  schedule?: {
    publishAt: string;
    expireAt?: string;
  };
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  platforms: ('web' | 'mobile' | 'email')[];
  hasAttachments: boolean;
}

interface AnnouncementMetrics {
  total: number;
  active: number;
  scheduled: number;
  avgEngagement: number;
  byType: {
    type: string;
    count: number;
  }[];
  byPlatform: {
    platform: string;
    count: number;
  }[];
  trends: {
    date: string;
    announcements: number;
    views: number;
    engagements: number;
  }[];
}

const AnnouncementsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample data
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Platform Maintenance Update',
      content: 'We will be performing scheduled maintenance on...',
      type: 'general',
      status: 'published',
      priority: 'high',
      audience: {
        total: 5000,
        groups: ['all-users'],
        roles: ['student', 'instructor']
      },
      metrics: {
        views: 3500,
        engagements: 2800,
        dismissals: 200
      },
      createdBy: {
        id: '1',
        name: 'John Doe',
        role: 'admin'
      },
      createdAt: '2024-01-25T10:30:00',
      updatedAt: '2024-01-25T10:30:00',
      platforms: ['web', 'mobile', 'email'],
      hasAttachments: true
    },
    // Add more announcements...
  ];

  // Metrics calculation
  const metrics: AnnouncementMetrics = {
    total: announcements.length,
    active: announcements.filter(a => a.status === 'published').length,
    scheduled: announcements.filter(a => a.status === 'scheduled').length,
    avgEngagement: announcements.reduce((acc, a) => 
      acc + (a.metrics.engagements / a.audience.total), 0) / announcements.length * 100,
    byType: [
      { type: 'General', count: 45 },
      { type: 'Course', count: 30 },
      { type: 'Event', count: 15 },
      { type: 'Update', count: 10 }
    ],
    byPlatform: [
      { platform: 'Web', count: 100 },
      { platform: 'Mobile', count: 80 },
      { platform: 'Email', count: 60 }
    ],
    trends: [
      {
        date: '2024-01',
        announcements: 15,
        views: 12000,
        engagements: 8000
      },
      // Add more trend data...
    ]
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = (
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || announcement.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Announcements</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.total}</h3>
              <div className="text-sm text-green-600">
                +12.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconBellRinging className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Announcements</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.active}</h3>
              <div className="text-sm text-green-600">
                +5.2% vs last month
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <IconBell className="h-6 w-6 text-green-600 dark:text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled Announcements</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.scheduled}</h3>
              <div className="text-sm text-yellow-600">
                +3.8% vs last month
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <IconCalendarTime className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Engagement Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.avgEngagement.toFixed(1)}%
              </h3>
              <div className="text-sm text-green-600">
                +7.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <IconEye className="h-6 w-6 text-purple-600 dark:text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcement Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <EnhancedAnalyticsDashboardChart
            data={metrics.trends}
            series={[
              {
                type: 'bar',
                dataKey: 'announcements',
                name: 'Announcements',
                color: '#3B82F6'
              },
              {
                type: 'line',
                dataKey: 'views',
                name: 'Views',
                color: '#10B981',
                curveType: 'monotone'
              },
              {
                type: 'line',
                dataKey: 'engagements',
                name: 'Engagements',
                color: '#F59E0B',
                curveType: 'monotone'
              }
            ]}
            xAxisKey="date"
            height={300}
            title="Announcement Performance"
            subtitle="Track views and engagement over time"
          />
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">By Type</h3>
            <div className="h-[300px]">
              <DonutChart
                data={metrics.byType.map(item => ({
                  name: item.type,
                  value: item.count,
                  color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][
                    metrics.byType.indexOf(item) % 4
                  ]
                }))}
                height={300}
                centerText={{
                  primary: metrics.total.toString(),
                  secondary: 'Total'
                }}
              />
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">By Platform</h3>
            <div className="h-[300px]">
              <DonutChart
                data={metrics.byPlatform.map(item => ({
                  name: item.platform,
                  value: item.count,
                  color: ['#3B82F6', '#10B981', '#F59E0B'][
                    metrics.byPlatform.indexOf(item) % 3
                  ]
                }))}
                height={300}
                centerText={{
                  primary: metrics.total.toString(),
                  secondary: 'Total'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="course">Course</option>
                <option value="event">Event</option>
                <option value="update">Update</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Create Announcement
              </button>

              <button
                onClick={() => {/* Export functionality */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
                title="Export Announcements"
              >
                <IconDownload className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                        flex items-center justify-center">
                        <IconUserCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {announcement.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full 
                          ${announcement.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : announcement.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        By {announcement.createdBy.name} • 
                        {new Date(announcement.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {announcement.platforms.map((platform) => (
                        <span key={platform} title={`Available on ${platform}`}>
                          {platform === 'web' && (
                            <IconWorld className="h-4 w-4 text-gray-400" />
                          )}
                          {platform === 'mobile' && (
                            <IconDeviceMobile className="h-4 w-4 text-gray-400" />
                          )}
                          {platform === 'email' && (
                            <IconBell className="h-4 w-4 text-gray-400" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                    {announcement.content}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <IconUsers className="h-4 w-4 mr-1" />
                      {announcement.audience.total.toLocaleString()} recipients
                    </div>
                    <div className="flex items-center">
                      <IconEye className="h-4 w-4 mr-1" />
                      {announcement.metrics.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <IconCheck className="h-4 w-4 mr-1" />
                      {((announcement.metrics.engagements / announcement.audience.total) * 100).toFixed(1)}% engagement
                    </div>
                    <div className="flex items-center">
                      <IconX className="h-4 w-4 mr-1" />
                      {((announcement.metrics.dismissals / announcement.audience.total) * 100).toFixed(1)}% dismissed
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full
                      ${announcement.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : announcement.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : announcement.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </span>
                    
                    {announcement.schedule && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 
                        text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      >
                        Scheduled for {new Date(announcement.schedule.publishAt).toLocaleString()}
                      </span>
                    )}

                    {announcement.hasAttachments && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 
                        text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      >
                        Has Attachments
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => {/* View announcement details */}}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                      dark:hover:bg-gray-700 rounded-lg"
                    title="View Details"
                  >
                    <IconEye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Edit announcement */}}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                      dark:hover:bg-gray-700 rounded-lg"
                    title="Edit Announcement"
                  >
                    <IconEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Delete announcement */}}
                    className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 
                      dark:hover:bg-red-900 rounded-lg"
                    title="Delete Announcement"
                  >
                    <IconTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <IconBellRinging className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No announcements found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new announcement.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 mx-auto"
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create Announcement
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredAnnouncements.length} of {announcements.length} announcements
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

export default AnnouncementsDashboard;