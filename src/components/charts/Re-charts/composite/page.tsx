'use client';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/Re-charts/composite/AnalyticsDashboardChart';
import React from 'react';
import type { ChartSeries, ChartDataPoint } from '@/components/charts/Re-charts/composite/AnalyticsDashboardChart';

// Define the data type to match ChartDataPoint
interface AnalyticsDataPoint extends ChartDataPoint {
  date: string;
  revenue: number;
  users: number;
  growth: number;
  courses: number;
  completionRate: number;
}

const Overview = () => {
  // Sample data with the correct type
  const data: AnalyticsDataPoint[] = [
    {
      date: '2024-01-01',
      revenue: 4500,
      users: 2400,
      growth: 20,
      courses: 150,
      completionRate: 75
    },
    {
      date: '2024-01-07',
      revenue: 5200,
      users: 2800,
      growth: 22,
      courses: 165,
      completionRate: 78
    },
    {
      date: '2024-01-14',
      revenue: 4800,
      users: 3000,
      growth: 18,
      courses: 180,
      completionRate: 72
    },
    {
      date: '2024-01-21',
      revenue: 6000,
      users: 3300,
      growth: 25,
      courses: 195,
      completionRate: 80
    },
    {
      date: '2024-01-28',
      revenue: 5500,
      users: 3500,
      growth: 21,
      courses: 210,
      completionRate: 77
    }
  ];

  // Chart series configuration with proper typing
  const series: ChartSeries[] = [
    {
      type: 'area',
      dataKey: 'revenue',
      name: 'Revenue',
      color: '#3B82F6',
      gradient: true,
      yAxisId: '1',
      curveType: 'monotone'
    },
    {
      type: 'line',
      dataKey: 'growth',
      name: 'Growth %',
      color: '#10B981',
      yAxisId: '2',
      curveType: 'monotone'
    },
    {
      type: 'bar',
      dataKey: 'users',
      name: 'Active Users',
      color: '#F59E0B',
      yAxisId: '1'
    },
    {
      type: 'line',
      dataKey: 'completionRate',
      name: 'Completion Rate %',
      color: '#8B5CF6',
      yAxisId: '2',
      curveType: 'monotone'
    }
  ];

  // Reference lines for targets
  const references = [
    {
      value: 5000,
      label: 'Revenue Target',
      color: '#EF4444',
      yAxisId: '1'
    },
    {
      value: 20,
      label: 'Growth Target',
      color: '#10B981',
      yAxisId: '2'
    }
  ];

  // Filter options
  const filterOptions = {
    courseType: [
      { label: 'All Courses', value: 'all' },
      { label: 'Programming', value: 'programming' },
      { label: 'Design', value: 'design' },
      { label: 'Business', value: 'business' }
    ],
    userType: [
      { label: 'All Users', value: 'all' },
      { label: 'Students', value: 'students' },
      { label: 'Instructors', value: 'instructors' }
    ]
  };

  // Time frames
  const timeFrames = [
    { label: '7D', value: '7d', range: 7 },
    { label: '1M', value: '1m', range: 30 },
    { label: '3M', value: '3m', range: 90 },
    { label: 'YTD', value: 'ytd', range: 365 },
    { label: '1Y', value: '1y', range: 365 },
    { label: 'All', value: 'all', range: 0 }
  ];

  // Properly typed handler for filtered data
  const handleDataFiltered = (filteredData: ChartDataPoint[]) => {
    const typedData = filteredData as AnalyticsDataPoint[];
    // console.log('Filtered data:', typedData);
    // Handle filtered data if needed
  };

  return (
    <div className="p-6 space-y-6">
      <EnhancedAnalyticsDashboardChart
        data={data}
        series={series}
        xAxisKey="date"
        height={500}
        theme="light"
        currency
        references={references}
        title="Learning Platform Analytics"
        subtitle="Track key metrics and performance indicators"
        filterOptions={filterOptions}
        timeFrames={timeFrames}
        enableExport={true}
        enableFilters={true}
        enableTimeFrames={true}
        chartTypes={['line', 'area', 'bar']}
        onDataFiltered={handleDataFiltered}
      />
    </div>
  );
};

export default Overview;