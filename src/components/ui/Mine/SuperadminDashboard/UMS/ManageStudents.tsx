'use client';
// src/components/ui/Mine/ManageStudentsDashboard/ManageStudentsDashboard.tsx

import React, { useState } from 'react';
import { DonutChart } from '@/components/charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/composite/AnalyticsDashboardChart';
import {
  IconUsers,
  IconBook,
  IconCertificate,
  IconClockHour4,
  IconSearch,
  IconFilter,
  IconDownload,
  IconRefresh,
  IconEdit,
  IconMail,
  IconBan,
  IconTrash,
  IconEye,
  IconPlayerPlay,
  IconDeviceLaptop
} from '@tabler/icons-react';

interface Student {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'banned';
  enrolledCourses: number;
  completedCourses: number;
  totalWatchTime: number;
  averageProgress: number;
  certificates: number;
  currentlyWatching?: {
    courseId: string;
    courseName: string;
    lastWatched: string;
    progress: number;
  }[];
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  lastAccessed: string;
  totalDuration: number;
  watchedDuration: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

const ManageStudentsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Sample student data
  const students: Student[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      joinDate: '2024-01-01',
      lastActive: '2024-01-25T10:30:00',
      status: 'active',
      enrolledCourses: 5,
      completedCourses: 3,
      totalWatchTime: 4500, // in minutes
      averageProgress: 75,
      certificates: 2,
      currentlyWatching: [
        {
          courseId: '1',
          courseName: 'Advanced React Development',
          lastWatched: '2024-01-25T10:30:00',
          progress: 65
        },
        {
          courseId: '2',
          courseName: 'Node.js Backend Development',
          lastWatched: '2024-01-24T15:45:00',
          progress: 30
        }
      ]
    },
    // Add more students...
  ];

  // Activity metrics
  const studentMetrics = [
    {
      title: "Total Students",
      value: students.length,
      change: +12.5,
      icon: <IconUsers className="h-6 w-6" />,
      color: "#3B82F6"
    },
    {
      title: "Active Learners",
      value: students.filter(s => s.status === 'active').length,
      change: +8.2,
      icon: <IconDeviceLaptop className="h-6 w-6" />,
      color: "#10B981"
    },
    {
      title: "Course Completions",
      value: students.reduce((acc, s) => acc + s.completedCourses, 0),
      change: +15.3,
      icon: <IconCertificate className="h-6 w-6" />,
      color: "#F59E0B"
    },
    {
      title: "Avg. Watch Time",
      value: `${Math.round(students.reduce((acc, s) => acc + s.totalWatchTime, 0) / students.length / 60)}h`,
      change: +5.8,
      icon: <IconClockHour4 className="h-6 w-6" />,
      color: "#8B5CF6"
    }
  ];

  // Sample course data for charts
  const courseProgressData = students.map(student => ({
    date: student.joinDate,
    enrollments: student.enrolledCourses,
    completions: student.completedCourses,
    averageProgress: student.averageProgress,
    watchTime: student.totalWatchTime / 60 // convert to hours
  }));

  const courseDistribution = [
    { name: 'Completed', value: 450, color: '#10B981' },
    { name: 'In Progress', value: 320, color: '#F59E0B' },
    { name: 'Not Started', value: 230, color: '#EF4444' }
  ];

  const courseEngagement = [
    { name: 'High', value: 280, color: '#3B82F6' },
    { name: 'Medium', value: 420, color: '#8B5CF6' },
    { name: 'Low', value: 300, color: '#F59E0B' }
  ];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = (
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                <div className={`flex items-center mt-2 ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="text-sm font-medium">
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <EnhancedAnalyticsDashboardChart
          data={courseProgressData}
          series={[
            {
              type: 'line',
              dataKey: 'enrollments',
              name: 'Course Enrollments',
              color: '#3B82F6',
              yAxisId: '1',
              curveType: 'monotone'
            },
            {
              type: 'line',
              dataKey: 'completions',
              name: 'Course Completions',
              color: '#10B981',
              yAxisId: '1',
              curveType: 'monotone'
            },
            {
              type: 'area',
              dataKey: 'averageProgress',
              name: 'Average Progress',
              color: '#8B5CF6',
              yAxisId: '2',
              curveType: 'monotone'
            },
            {
              type: 'bar',
              dataKey: 'watchTime',
              name: 'Watch Time (hours)',
              color: '#F59E0B',
              yAxisId: '1'
            }
          ]}
          xAxisKey="date"
          height={400}
          title="Learning Progress Overview"
          subtitle="Track student engagement and course completion metrics"
          enableExport={true}
          enableFilters={true}
          enableTimeFrames={true}
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Course Progress Distribution</h3>
          <div className="h-[300px]">
            <DonutChart
              data={courseDistribution}
              height={300}
              centerText={{
                primary: '1,000',
                secondary: 'Total Enrollments'
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Student Engagement Levels</h3>
          <div className="h-[300px]">
            <DonutChart
              data={courseEngagement}
              height={300}
              centerText={{
                primary: '1,000',
                secondary: 'Total Students'
              }}
            />
          </div>
        </div>
      </div>

      {/* Student Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* Implement export */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
              >
                <IconDownload className="h-5 w-5" />
              </button>
              <button
                onClick={() => {/* Implement refresh */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
              >
                <IconRefresh className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enrolled Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Watch Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Currently Watching
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 
                          flex items-center justify-center text-blue-600 dark:text-blue-200 font-medium">
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${student.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : student.status === 'banned'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <IconBook className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{student.enrolledCourses}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">courses</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${student.averageProgress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {student.averageProgress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <IconClockHour4 className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {Math.floor(student.totalWatchTime / 60)}h {student.totalWatchTime % 60}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {student.currentlyWatching?.map((course, idx) => (
                        <div 
                          key={course.courseId}
                          className={`flex items-center ${idx > 0 ? 'mt-2' : ''}`}
                        >
                          <IconPlayerPlay className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white truncate">
                              {course.courseName}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {course.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {/* View student details */}}
                        className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                          dark:hover:text-gray-300"
                        title="View Details"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Send email */}}
                        className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                          dark:hover:text-gray-300"
                        title="Send Email"
                      >
                        <IconMail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Ban student */}}
                        className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                          dark:hover:text-gray-300"
                        title={student.status === 'banned' ? 'Unban Student' : 'Ban Student'}
                      >
                        <IconBan className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Delete student */}}
                        className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 
                          dark:hover:text-red-300"
                        title="Delete Student"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <IconUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No students found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No students match your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredStudents.length} of {students.length} students
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

export default ManageStudentsDashboard;