'use client';
// src/components/ui/Mine/CoursesDashboard/CourseManagement.tsx

import React, { useState } from 'react';
import { DonutChart } from '@/components/charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/composite/AnalyticsDashboardChart';
import {
  IconBook,
  IconUsers,
  IconPlayerPlay,
  IconClock,
  IconTrophy,
  IconPlus,
  IconSearch,
  IconFilter,
  IconDownload,
  IconEdit,
  IconTrash,
  IconEye,
  IconPencil,
  IconLayoutGrid,
  IconList,
  IconAdjustments,
  IconStarFilled,
  IconCertificate
} from '@tabler/icons-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  createdBy: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  enrollments: number;
  completionRate: number;
  averageRating: number;
  totalWatchTime: number;
  revenue: number;
  status: 'draft' | 'published' | 'archived';
  lastUpdated: string;
  thumbnail: string;
  sections: number;
  lessons: number;
}

interface CourseAnalytics {
  totalEnrollments: number;
  totalCompletions: number;
  averageWatchTime: number;
  totalRevenue: number;
  popularCategories: { category: string; count: number; }[];
  monthlyEnrollments: { month: string; count: number; }[];
  instructorPerformance: { instructor: string; students: number; rating: number; }[];
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Course>) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: 'beginner',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Create New Course</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 rounded-lg"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample course data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced React Development',
      description: 'Master React with advanced concepts and patterns',
      instructor: 'John Doe',
      createdBy: 'Admin User',
      category: 'Web Development',
      level: 'advanced',
      duration: 1800,
      enrollments: 1500,
      completionRate: 78,
      averageRating: 4.8,
      totalWatchTime: 45000,
      revenue: 15000,
      status: 'published',
      lastUpdated: '2024-01-25',
      thumbnail: '/course-thumbnail.jpg',
      sections: 12,
      lessons: 48
    },
    // Add more courses...
  ];

  // Analytics data
  const analytics: CourseAnalytics = {
    totalEnrollments: courses.reduce((acc, course) => acc + course.enrollments, 0),
    totalCompletions: courses.reduce((acc, course) => 
      acc + Math.floor(course.enrollments * (course.completionRate / 100)), 0),
    averageWatchTime: courses.reduce((acc, course) => acc + course.totalWatchTime, 0) / courses.length,
    totalRevenue: courses.reduce((acc, course) => acc + course.revenue, 0),
    popularCategories: [
      { category: 'Web Development', count: 450 },
      { category: 'Data Science', count: 380 },
      { category: 'Mobile Development', count: 320 },
      { category: 'UI/UX Design', count: 280 }
    ],
    monthlyEnrollments: [
      { month: '2024-01', count: 250 },
      { month: '2024-02', count: 320 },
      { month: '2024-03', count: 280 },
      { month: '2024-04', count: 420 }
    ],
    instructorPerformance: [
      { instructor: 'John Doe', students: 850, rating: 4.8 },
      { instructor: 'Jane Smith', students: 720, rating: 4.6 },
      { instructor: 'Mike Johnson', students: 650, rating: 4.7 }
    ]
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  // Course analytics data
  const courseProgressData = courses.map(course => ({
    name: course.title,
    enrollments: course.enrollments,
    completions: Math.floor(course.enrollments * (course.completionRate / 100)),
    revenue: course.revenue,
    watchTime: course.totalWatchTime / 60 // convert to hours
  }));

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Enrollments</p>
              <h3 className="text-2xl font-bold mt-1">{analytics.totalEnrollments.toLocaleString()}</h3>
              <div className="text-sm text-green-600">
                +12.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconUsers className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Course Completions</p>
              <h3 className="text-2xl font-bold mt-1">{analytics.totalCompletions.toLocaleString()}</h3>
              <div className="text-sm text-green-600">
                +8.2% vs last month
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <IconCertificate className="h-6 w-6 text-green-600 dark:text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Watch Time</p>
              <h3 className="text-2xl font-bold mt-1">
                {Math.floor(analytics.averageWatchTime / 60)}h
              </h3>
              <div className="text-sm text-green-600">
                +15.3% vs last month
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <IconClock className="h-6 w-6 text-purple-600 dark:text-purple-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                ${analytics.totalRevenue.toLocaleString()}
              </h3>
              <div className="text-sm text-green-600">
                +10.8% vs last month
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <IconTrophy className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <EnhancedAnalyticsDashboardChart
            data={courseProgressData}
            series={[
              {
                // Continuation of CourseManagement.tsx

                type: 'bar',
                dataKey: 'enrollments',
                name: 'Enrollments',
                color: '#3B82F6'
              },
              {
                type: 'line',
                dataKey: 'completions',
                name: 'Completions',
                color: '#10B981'
              },
              {
                type: 'line',
                dataKey: 'revenue',
                name: 'Revenue',
                color: '#F59E0B',
                yAxisId: '2'
              }
            ]}
            xAxisKey="name"
            height={300}
            title="Course Performance"
            subtitle="Track enrollments, completions, and revenue"
          />
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Popular Categories</h3>
          <div className="h-[300px]">
            <DonutChart
              data={analytics.popularCategories.map(cat => ({
                name: cat.category,
                value: cat.count,
                color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][
                  analytics.popularCategories.indexOf(cat) % 4
                ]
              }))}
              height={300}
              centerText={{
                primary: analytics.popularCategories.reduce((acc, cat) => acc + cat.count, 0).toString(),
                secondary: 'Total Courses'
              }}
            />
          </div>
        </div>
      </div>

      {/* Course Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
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
                {Array.from(new Set(courses.map(c => c.category))).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
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
                Add Course
              </button>

              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'} 
                    rounded-l-lg`}
                >
                  <IconLayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'} 
                    rounded-r-lg`}
                >
                  <IconList className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => {/* Export functionality */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
              >
                <IconDownload className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid/List View */}
        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border 
                    border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-600">
                    {/* Course thumbnail */}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <IconUsers className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {course.enrollments.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <IconStarFilled className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {course.averageRating}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <IconClock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {Math.floor(course.duration / 60)}h {course.duration % 60}m
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${course.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : course.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-gray-900 
                          dark:text-gray-400 dark:hover:text-gray-300">
                          <IconEye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-900 
                          dark:text-gray-400 dark:hover:text-gray-300">
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900 
                          dark:text-red-400 dark:hover:text-red-300">
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                      dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                      dark:text-gray-400 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                      dark:text-gray-400 uppercase tracking-wider">
                      Metrics
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                      dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 
                      dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded">
                            {/* Course thumbnail */}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {course.instructor}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {course.createdBy}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.enrollments.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Students
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.averageRating}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Rating
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              ${course.revenue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Revenue
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${course.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : course.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {course.status.charAt(0).toUpperCase() + course.status.slice
                          (1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {/* View course */}}
                              className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                                dark:hover:text-gray-300"
                              title="View Course"
                            >
                              <IconEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {/* Edit course */}}
                              className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                                dark:hover:text-gray-300"
                              title="Edit Course"
                            >
                              <IconEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {/* Delete course */}}
                              className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 
                                dark:hover:text-red-300"
                              title="Delete Course"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
  
            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <IconBook className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No courses found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No courses match your search criteria.
                </p>
              </div>
            )}
          </div>
  
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredCourses.length} of {courses.length} courses
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
  
        {/* Create Course Modal */}
        <CreateCourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => {
            // console.log('Creating course:', data);
            // Implement course creation logic
          }}
        />
      </div>
    );
  };
  
  export default CourseManagement;