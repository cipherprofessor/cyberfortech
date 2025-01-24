'use client';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  IconArrowUpRight, 
  IconArrowDownRight,
  IconCurrencyDollar,
  IconUsers,
  IconShoppingCart,
  IconRefresh,
  IconDownload,
  IconFilter,
  IconChevronDown
} from '@tabler/icons-react';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon,
  trend = 'up'
}: { 
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <span className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
        {icon}
      </span>
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="flex items-center text-sm">
        {trend === 'up' ? (
          <IconArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
        ) : (
          <IconArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
        )}
        <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
          {change}
        </span>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
    <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {action}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const DateRangeSelector = () => (
  <div className="relative">
    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <IconFilter className="h-4 w-4" />
      <span>Filter by date</span>
      <IconChevronDown className="h-4 w-4" />
    </button>
  </div>
);

const ViewSelect = () => (
  <select className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
);

export function RevenueOverview() {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - replace with your API calls
  const data = {
    metrics: {
      totalRevenue: 45231.89,
      subscriptions: 2350,
      activeStudents: 1200,
      courseSales: 12234,
      revenueGrowth: 20.1,
      subscriptionGrowth: 180.1,
      studentGrowth: -8.1,
      salesGrowth: 19
    },
    monthlyData: [
      { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
      { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
      { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
      { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
      { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
      { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
    ],
    courseRevenue: [
      { name: 'Web Development', value: 15000 },
      { name: 'Mobile Development', value: 12000 },
      { name: 'Data Science', value: 9800 },
      { name: 'UI/UX Design', value: 8200 },
    ]
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data.monthlyData[0]).join(",") + "\n"
      + data.monthlyData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <DateRangeSelector />
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsLoading(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={isLoading}
            >
              <IconRefresh className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button 
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <IconDownload className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${data.metrics.totalRevenue.toLocaleString()}`}
          change={`${data.metrics.revenueGrowth}% from last month`}
          icon={<IconCurrencyDollar className="h-5 w-5 text-blue-500" />}
          trend="up"
        />
        <MetricCard
          title="Subscriptions"
          value={data.metrics.subscriptions.toString()}
          change={`${data.metrics.subscriptionGrowth}% from last month`}
          icon={<IconRefresh className="h-5 w-5 text-green-500" />}
          trend="up"
        />
        <MetricCard
          title="Active Students"
          value={data.metrics.activeStudents.toString()}
          change={`${data.metrics.studentGrowth}% from last month`}
          icon={<IconUsers className="h-5 w-5 text-red-500" />}
          trend="down"
        />
        <MetricCard
          title="Course Sales"
          value={data.metrics.courseSales.toString()}
          change={`${data.metrics.salesGrowth}% from last month`}
          icon={<IconShoppingCart className="h-5 w-5 text-purple-500" />}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <div className="lg:col-span-4">
          <ChartCard 
            title="Revenue Overview" 
            action={<ViewSelect />}
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Course Revenue Distribution */}
        <div className="lg:col-span-3">
          <ChartCard title="Course Revenue Distribution">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.courseRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.courseRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Course Purchase #{i}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</div>
                </div>
                <div className="text-green-500 font-medium">+$99.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}