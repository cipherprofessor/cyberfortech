'use client';
// src/components/ui/Mine/FinanceDashboard/FinanceOverview.tsx

import React from 'react';
import { DonutChart } from '@/components/charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/composite/AnalyticsDashboardChart';
import {
  IconCurrencyDollar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconChartBar,
  IconReceipt,
  IconCreditCard,
  IconWallet,
  IconShoppingCart,
  IconBook,
  IconDownload,
  IconFilter,
  IconCalendar
} from '@tabler/icons-react';

interface FinanceMetrics {
  totalRevenue: number;
  netIncome: number;
  totalExpenses: number;
  averageOrderValue: number;
  revenueBySource: {
    source: string;
    amount: number;
  }[];
  monthlyTrends: {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  courseRevenue: {
    course: string;
    revenue: number;
    students: number;
  }[];
  paymentMethods: {
    method: string;
    value: number;
  }[];
}

const FinanceOverview = () => {
  // Sample finance metrics
  const metrics: FinanceMetrics = {
    totalRevenue: 1250000,
    netIncome: 750000,
    totalExpenses: 500000,
    averageOrderValue: 199,
    revenueBySource: [
      { source: 'Course Sales', amount: 800000 },
      { source: 'Subscriptions', amount: 300000 },
      { source: 'Consulting', amount: 100000 },
      { source: 'Other', amount: 50000 }
    ],
    monthlyTrends: [
      {
        date: '2024-01',
        revenue: 120000,
        expenses: 45000,
        profit: 75000
      },
      // Add more monthly data...
    ],
    courseRevenue: [
      {
        course: 'Advanced Web Development',
        revenue: 250000,
        students: 500
      },
      // Add more course data...
    ],
    paymentMethods: [
      { method: 'Credit Card', value: 650000 },
      { method: 'PayPal', value: 450000 },
      { method: 'Bank Transfer', value: 150000 }
    ]
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  // Sample previous period values
  const previousPeriod = {
    revenue: 1100000,
    income: 680000,
    expenses: 420000,
    orderValue: 189
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                ${metrics.totalRevenue.toLocaleString()}
              </h3>
              <div className="flex items-center text-sm">
                {calculateGrowth(metrics.totalRevenue, previousPeriod.revenue) >= 0 ? (
                  <div className="text-green-600 flex items-center">
                    <IconArrowUpRight className="h-4 w-4 mr-1" />
                    +{calculateGrowth(metrics.totalRevenue, previousPeriod.revenue).toFixed(1)}%
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <IconArrowDownRight className="h-4 w-4 mr-1" />
                    {calculateGrowth(metrics.totalRevenue, previousPeriod.revenue).toFixed(1)}%
                  </div>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconCurrencyDollar className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Income</p>
              <h3 className="text-2xl font-bold mt-1">
                ${metrics.netIncome.toLocaleString()}
              </h3>
              <div className="flex items-center text-sm">
                {calculateGrowth(metrics.netIncome, previousPeriod.income) >= 0 ? (
                  <div className="text-green-600 flex items-center">
                    <IconArrowUpRight className="h-4 w-4 mr-1" />
                    +{calculateGrowth(metrics.netIncome, previousPeriod.income).toFixed(1)}%
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <IconArrowDownRight className="h-4 w-4 mr-1" />
                    {calculateGrowth(metrics.netIncome, previousPeriod.income).toFixed(1)}%
                  </div>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <IconWallet className="h-6 w-6 text-green-600 dark:text-green-200" />
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1">
                ${metrics.totalExpenses.toLocaleString()}
              </h3>
              <div className="flex items-center text-sm">
                {calculateGrowth(metrics.totalExpenses, previousPeriod.expenses) >= 0 ? (
                  <div className="text-red-600 flex items-center">
                    <IconArrowUpRight className="h-4 w-4 mr-1" />
                    +{calculateGrowth(metrics.totalExpenses, previousPeriod.expenses).toFixed(1)}%
                  </div>
                ) : (
                  <div className="text-green-600 flex items-center">
                    <IconArrowDownRight className="h-4 w-4 mr-1" />
                    {calculateGrowth(metrics.totalExpenses, previousPeriod.expenses).toFixed(1)}%
                  </div>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <IconReceipt className="h-6 w-6 text-red-600 dark:text-red-200" />
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order Value</p>
              <h3 className="text-2xl font-bold mt-1">
                ${metrics.averageOrderValue.toLocaleString()}
              </h3>
              <div className="flex items-center text-sm">
                {calculateGrowth(metrics.averageOrderValue, previousPeriod.orderValue) >= 0 ? (
                  <div className="text-green-600 flex items-center">
                    <IconArrowUpRight className="h-4 w-4 mr-1" />
                    +{calculateGrowth(metrics.averageOrderValue, previousPeriod.orderValue).toFixed(1)}%
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <IconArrowDownRight className="h-4 w-4 mr-1" />
                    {calculateGrowth(metrics.averageOrderValue, previousPeriod.orderValue).toFixed(1)}%
                  </div>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <IconShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <EnhancedAnalyticsDashboardChart
            data={metrics.monthlyTrends}
            series={[
              {
                type: 'line',
                dataKey: 'revenue',
                name: 'Revenue',
                color: '#3B82F6',
                curveType: 'monotone'
              },
              {
                type: 'line',
                dataKey: 'expenses',
                name: 'Expenses',
                color: '#EF4444',
                curveType: 'monotone'
              },
              {
                type: 'area',
                dataKey: 'profit',
                name: 'Profit',
                color: '#10B981',
                curveType: 'monotone'
              }
            ]}
            xAxisKey="date"
            height={400}
            title="Revenue & Expenses Trend"
            subtitle="Monthly financial performance"
          />
        </div>

        {/* Revenue Distribution */}
        <div className="grid grid-cols-2 gap-6">
          {/* Revenue by Source */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">Revenue by Source</h3>
            <div className="h-[300px]">
              <DonutChart
                data={metrics.revenueBySource.map(source => ({
                  name: source.source,
                  value: source.amount,
                  color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][
                    metrics.revenueBySource.indexOf(source) % 4
                  ]
                }))}
                height={300}
                centerText={{
                  primary: `$${(metrics.totalRevenue / 1000).toFixed(0)}K`,
                  secondary: 'Total Revenue'
                }}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">Payment Methods</h3>
            <div className="h-[300px]">
              <DonutChart
                data={metrics.paymentMethods.map(method => ({
                  name: method.method,
                  value: method.value,
                  color: ['#3B82F6', '#10B981', '#F59E0B'][
                    metrics.paymentMethods.indexOf(method) % 3
                  ]
                }))}
                height={300}
                centerText={{
                  primary: `${metrics.paymentMethods.length}`,
                  secondary: 'Methods'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top Performing Courses</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <IconFilter className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <IconDownload className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Students
                </th>
                // Continuation of FinanceOverview.tsx

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg. Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Refund Rate
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.courseRevenue.map((course) => (
                <tr key={course.course} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 
                          flex items-center justify-center">
                          <IconBook className="h-5 w-5 text-blue-600 dark:text-blue-200" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.course}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${course.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +15% from last month
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.students.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Active students
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(course.revenue / course.students).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Per student
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 
                      text-green-800 dark:bg-green-900 dark:text-green-200">
                      2.4%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <IconChartBar className="h-6 w-6 text-gray-400 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Generate Report
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
              text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Export Transactions
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
              text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              View All Reports
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 
                  flex items-center justify-center">
                  <IconCurrencyDollar className="h-4 w-4 text-blue-600 dark:text-blue-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    New transaction received
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </p>
                </div>
                <div className="text-sm font-medium text-green-600">
                  +$299.00
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Upcoming Payments</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 
                  flex items-center justify-center">
                  <IconCalendar className="h-4 w-4 text-yellow-600 dark:text-yellow-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Instructor payout
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due in 3 days
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  $1,250.00
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;