'use client';
// src/components/ui/Mine/CoursesDashboard/CourseReviews.tsx

import React, { useState } from 'react';
import {
  IconStar,
  IconStarFilled,
  IconSearch,
  IconFilter,
  IconTrash,
  IconEdit,
  IconThumbUp,
  IconThumbDown,
  IconFlag,
  IconMessageCircle,
  IconCalendar
} from '@tabler/icons-react';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/composite/AnalyticsDashboardChart';
import { DonutChart } from '@/components/charts/base/DonutChart';

interface Review {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  isVerifiedPurchase: boolean;
  reported: boolean;
  status: 'published' | 'pending' | 'rejected';
}

interface ReviewsMetrics {
  totalReviews: number;
  averageRating: number;
  reviewsDistribution: { rating: number; count: number; }[];
  recentTrend: { date: string; rating: number; count: number; }[];
  topCourses: { courseId: string; courseName: string; rating: number; reviews: number; }[];
}

const CourseReviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample data
  const reviews: Review[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'Advanced React Development',
      userId: '1',
      userName: 'Arsalan Rayees',
      rating: 5,
      title: 'Excellent course!',
      content: 'This course exceeded my expectations. The content is well-structured and the instructor explains everything clearly.',
      createdAt: '2024-01-25T10:30:00',
      likes: 12,
      dislikes: 1,
      isVerifiedPurchase: true,
      reported: false,
      status: 'published'
    },
    // Add more reviews...
  ];

  const metrics: ReviewsMetrics = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    reviewsDistribution: [
      { rating: 5, count: 450 },
      { rating: 4, count: 280 },
      { rating: 3, count: 120 },
      { rating: 2, count: 50 },
      { rating: 1, count: 30 }
    ],
    recentTrend: [
      { date: '2024-01', rating: 4.5, count: 120 },
      { date: '2024-02', rating: 4.6, count: 150 },
      { date: '2024-03', rating: 4.8, count: 180 }
    ],
    topCourses: [
      { courseId: '1', courseName: 'Advanced React', rating: 4.8, reviews: 250 },
      { courseId: '2', courseName: 'Node.js Mastery', rating: 4.7, reviews: 180 }
    ]
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = (
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCourse = selectedCourse === 'all' || review.courseId === selectedCourse;
    const matchesRating = selectedRating === 'all' || review.rating === Number(selectedRating);
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesRating && matchesStatus;
  });

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      index < rating 
        ? <IconStarFilled key={index} className="h-4 w-4 text-yellow-400" />
        : <IconStar key={index} className="h-4 w-4 text-gray-300" />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.totalReviews}</h3>
              <div className="text-sm text-green-600">
                +12.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconMessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
              <div className="flex items-center mt-1">
                <h3 className="text-2xl font-bold mr-2">{metrics.averageRating.toFixed(1)}</h3>
                <div className="flex">
                  {renderStars(Math.round(metrics.averageRating))}
                </div>
              </div>
              <div className="text-sm text-green-600">
                +0.3 vs last month
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <IconStarFilled className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Add more metric cards */}
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Rating Distribution</h3>
          <div className="space-y-4">
            {metrics.reviewsDistribution.map((dist) => (
              <div key={dist.rating} className="flex items-center">
                <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                  {dist.rating} stars
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400"
                      style={{ 
                        width: `${(dist.count / metrics.totalReviews) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {dist.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <EnhancedAnalyticsDashboardChart
            data={metrics.recentTrend}
            series={[
              {
                type: 'line',
                dataKey: 'rating',
                name: 'Average Rating',
                color: '#F59E0B',
                yAxisId: '1'
              },
              {
                type: 'bar',
                dataKey: 'count',
                name: 'Review Count',
                color: '#3B82F6',
                yAxisId: '2'
              }
            ]}
            xAxisKey="date"
            height={300}
            title="Rating Trends"
            subtitle="Track average ratings and review volume"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                {Array.from(new Set(reviews.map(r => r.courseId))).map(courseId => (
                  <option key={courseId} value={courseId}>
                    {reviews.find(r => r.courseId === courseId)?.courseName}
                  </option>
                ))}
              </select>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                // Continuation of CourseReviews.tsx

                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {review.title}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {review.content}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                    <span>{review.userName}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <IconCalendar className="h-4 w-4 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {review.courseName}
                    </span>
                    {review.isVerifiedPurchase && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 dark:text-green-400">
                          Verified Purchase
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <IconThumbUp className="h-4 w-4 mr-1" />
                        {review.likes}
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <IconThumbDown className="h-4 w-4 mr-1" />
                        {review.dislikes}
                      </button>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        review.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : review.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2 ml-4">
                  {review.reported && (
                    <span className="p-1 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 rounded">
                      <IconFlag className="h-4 w-4" />
                    </span>
                  )}
                  <button
                    onClick={() => {/* Edit review */}}
                    className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                      dark:hover:text-gray-300"
                    title="Edit Review"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {/* Delete review */}}
                    className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 
                      dark:hover:text-red-300"
                    title="Delete Review"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <IconMessageCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No reviews found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No reviews match your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredReviews.length} of {reviews.length} reviews
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

export default CourseReviews;