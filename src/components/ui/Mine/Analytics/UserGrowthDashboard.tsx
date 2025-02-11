'use client';
// src/components/ui/Mine/UserGrowthDashboard/UserGrowthDashboard.tsx

import React from 'react';
import { 
  EnhancedAnalyticsDashboardChart,
  ChartSeries,
  ChartDataPoint
} from '@/components/charts/Re-charts/composite/AnalyticsDashboardChart';
import { DonutChart } from '@/components/charts/Re-charts/base/DonutChart';
import { 
  IconUsers, 
  IconUserPlus, 
  IconUserMinus,
  IconUserCheck,
  IconDevices2,
  IconWorld,
  IconBrandGoogle,
  IconBrandFacebook,
  IconMail
} from '@tabler/icons-react';

interface UserMetric {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface UserGrowthDashboardProps {
  // Add any props you need
}

const UserGrowthDashboard: React.FC<UserGrowthDashboardProps> = () => {
  // Sample user metrics
  const userMetrics: UserMetric[] = [
    {
      title: "Total Users",
      value: 25647,
      change: 12.5,
      icon: <IconUsers className="h-6 w-6" />,
      color: "#3B82F6"
    },
    {
      title: "Active Users (30d)",
      value: 18234,
      change: 8.2,
      icon: <IconUserCheck className="h-6 w-6" />,
      color: "#10B981"
    },
    {
      title: "New Users (30d)",
      value: 2845,
      change: 15.3,
      icon: <IconUserPlus className="h-6 w-6" />,
      color: "#6366F1"
    },
    {
      title: "Churned Users (30d)",
      value: 465,
      change: -5.8,
      icon: <IconUserMinus className="h-6 w-6" />,
      color: "#EF4444"
    }
  ];

  // Sample data for user growth
  const userGrowthData: ChartDataPoint[] = [
    {
      date: '2024-01-01',
      totalUsers: 22000,
      activeUsers: 15000,
      newUsers: 800,
      churnedUsers: 150,
      webUsers: 12000,
      mobileUsers: 10000
    },
    // Add more data points...
  ];

  // Chart series configuration
  const userGrowthSeries: ChartSeries[] = [
    {
      type: 'area',
      dataKey: 'totalUsers',
      name: 'Total Users',
      color: '#3B82F6',
      gradient: true,
      yAxisId: '1',
      curveType: 'monotone'
    },
    {
      type: 'line',
      dataKey: 'activeUsers',
      name: 'Active Users',
      color: '#10B981',
      yAxisId: '1',
      curveType: 'monotone'
    },
    {
      type: 'bar',
      dataKey: 'newUsers',
      name: 'New Users',
      color: '#6366F1',
      yAxisId: '2'
    },
    {
      type: 'bar',
      dataKey: 'churnedUsers',
      name: 'Churned Users',
      color: '#EF4444',
      yAxisId: '2'
    }
  ];

  // Platform distribution data for donut chart
  const platformData = [
    { name: 'Web App', value: 12000, color: '#3B82F6' },
    { name: 'Mobile App', value: 10000, color: '#10B981' },
    { name: 'Tablet', value: 3647, color: '#6366F1' }
  ];

  // User acquisition data for donut chart
  const acquisitionData = [
    { name: 'Direct', value: 8500, color: '#3B82F6' },
    { name: 'Google', value: 7200, color: '#EF4444' },
    { name: 'Facebook', value: 5400, color: '#1D4ED8' },
    { name: 'Email', value: 4547, color: '#10B981' }
  ];

  // Time frames
  const timeFrames = [
    { label: '7D', value: '7d', range: 7 },
    { label: '1M', value: '1m', range: 30 },
    { label: '3M', value: '3m', range: 90 },
    { label: 'YTD', value: 'ytd', range: 365 },
    { label: '1Y', value: '1y', range: 365 }
  ];

  return (
    <div className="space-y-6">
      {/* User Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userMetrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {metric.value.toLocaleString()}
                </h3>
                <div className={`flex items-center mt-2 ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="text-sm font-medium">
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    vs last period
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

      {/* Main Growth Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <EnhancedAnalyticsDashboardChart
          data={userGrowthData}
          series={userGrowthSeries}
          xAxisKey="date"
          height={400}
          theme="light"
          references={[
            {
              value: 20000,
              label: 'User Target',
              color: '#3B82F6',
              yAxisId: '1'
            }
          ]}
          title="User Growth Analytics"
          subtitle="Track user growth, activity, and churn rates"
          timeFrames={timeFrames}
          enableExport={true}
          enableFilters={true}
          enableTimeFrames={true}
        />
      </div>

      {/* Platform and Acquisition Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Platform Distribution</h3>
          <div className="h-[300px]">
            <DonutChart
              data={platformData}
              height={300}
              centerText={{
                primary: platformData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString(),
                secondary: 'Total Users'
              }}
            />
          </div>
        </div>

        {/* User Acquisition */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">User Acquisition</h3>
          <div className="h-[300px]">
            <DonutChart
              data={acquisitionData}
              height={300}
              centerText={{
                primary: acquisitionData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString(),
                secondary: 'Total Users'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthDashboard;