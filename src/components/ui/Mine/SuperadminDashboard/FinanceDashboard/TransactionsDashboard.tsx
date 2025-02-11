'use client';
// src/components/ui/Mine/FinanceDashboard/TransactionsDashboard.tsx

import React, { useState } from 'react';
import { DonutChart } from '@/components/charts/Re-charts/base/DonutChart';
import { EnhancedAnalyticsDashboardChart } from '@/components/charts/Re-charts/composite/AnalyticsDashboardChart';
import {
  IconCurrencyDollar,
  IconCreditCard,
  IconReceipt2,
  IconReportMoney,
  IconSearch,
  IconFilter,
  IconDownload,
  IconCalendar,
  IconChevronDown,
  IconEye,
  IconRefresh,
  IconCheck,
  IconX,
  IconDots,
  IconWorld,
  IconClockHour4
} from '@tabler/icons-react';

interface Transaction {
  id: string;
  type: 'purchase' | 'refund' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  customer: {
    id: string;
    name: string;
    email: string;
    country: string;
  };
  course?: {
    id: string;
    name: string;
    price: number;
  };
  paymentMethod: {
    type: string;
    last4?: string;
  };
  reference: string;
  processingFee: number;
}

interface TransactionMetrics {
  totalTransactions: number;
  successRate: number;
  avgTransactionValue: number;
  refundRate: number;
  volumeByType: {
    type: string;
    amount: number;
  }[];
  volumeByMethod: {
    method: string;
    amount: number;
  }[];
  trends: {
    date: string;
    volume: number;
    count: number;
    refunds: number;
  }[];
}

const TransactionsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Sample data
  const transactions: Transaction[] = [
    {
      id: 'TRX-001',
      type: 'purchase',
      amount: 199.99,
      status: 'completed',
      date: '2024-01-25T10:30:00',
      customer: {
        id: 'USR-001',
        name: 'Arsalan Rayees',
        email: 'john@example.com',
        country: 'US'
      },
      course: {
        id: 'CRS-001',
        name: 'Advanced Web Development',
        price: 199.99
      },
      paymentMethod: {
        type: 'credit_card',
        last4: '4242'
      },
      reference: 'ch_1234567890',
      processingFee: 5.99
    },
    // Add more transactions...
  ];

  // Calculate metrics
  const metrics: TransactionMetrics = {
    totalTransactions: transactions.length,
    successRate: (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100,
    avgTransactionValue: transactions.reduce((acc, t) => acc + t.amount, 0) / transactions.length,
    refundRate: (transactions.filter(t => t.status === 'refunded').length / transactions.length) * 100,
    volumeByType: [
      { type: 'Course Purchases', amount: 75000 },
      { type: 'Subscriptions', amount: 45000 },
      { type: 'Refunds', amount: -8000 }
    ],
    volumeByMethod: [
      { method: 'Credit Card', amount: 65000 },
      { method: 'PayPal', amount: 35000 },
      { method: 'Bank Transfer', amount: 12000 }
    ],
    trends: [
      {
        date: '2024-01',
        volume: 25000,
        count: 125,
        refunds: 3
      },
      // Add more trend data...
    ]
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = (
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Volume */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Volume</p>
              <h3 className="text-2xl font-bold mt-1">
                ${(metrics.totalTransactions * metrics.avgTransactionValue).toLocaleString()}
              </h3>
              <div className="text-sm text-green-600">
                +12.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconCurrencyDollar className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.successRate.toFixed(1)}%
              </h3>
              <div className="text-sm text-green-600">
                +2.3% vs last month
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <IconCheck className="h-6 w-6 text-green-600 dark:text-green-200" />
            </div>
          </div>
        </div>

        {/* Average Value */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Transaction</p>
              <h3 className="text-2xl font-bold mt-1">
                ${metrics.avgTransactionValue.toFixed(2)}
              </h3>
              <div className="text-sm text-green-600">
                +5.8% vs last month
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <IconReportMoney className="h-6 w-6 text-purple-600 dark:text-purple-200" />
            </div>
          </div>
        </div>

        {/* Refund Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Refund Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.refundRate.toFixed(1)}%
              </h3>
              <div className="text-sm text-red-600">
                +0.8% vs last month
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <IconReceipt2 className="h-6 w-6 text-red-600 dark:text-red-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <EnhancedAnalyticsDashboardChart
            data={metrics.trends}
            series={[
              {
                type: 'bar',
                dataKey: 'volume',
                name: 'Volume',
                color: '#3B82F6',
                yAxisId: '1'
              },
              {
                type: 'line',
                dataKey: 'count',
                name: 'Count',
                color: '#10B981',
                yAxisId: '2'
              },
              {
                type: 'line',
                dataKey: 'refunds',
                name: 'Refunds',
                color: '#EF4444',
                yAxisId: '2'
              }
            ]}
            xAxisKey="date"
            height={400}
            title="Transaction Trends"
            subtitle="Volume, count, and refunds over time"
          />
        </div>

        {/* Volume Distribution */}
        <div className="grid grid-cols-2 gap-6">
          {/* Volume by Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">Volume by Type</h3>
            <div className="h-[300px]">
              <DonutChart
                data={metrics.volumeByType.map(item => ({
                  name: item.type,
                  value: Math.abs(item.amount),
                  color: item.amount < 0 ? '#EF4444' : ['#3B82F6', '#10B981', '#F59E0B'][
                    metrics.volumeByType.indexOf(item) % 3
                  ]
                }))}
                height={300}
                centerText={{
                  primary: '$' + (metrics.volumeByType.reduce((acc, item) => acc + item.amount, 0) / 1000).toFixed(0) + 'K',
                  secondary: 'Total Volume'
                }}
              />
            </div>
          </div>

          {/* Volume by Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">By Payment Method</h3>
            <div className="h-[300px]">
              <DonutChart
                data={metrics.volumeByMethod.map(item => ({
                  name: item.method,
                  value: item.amount,
                  color: ['#3B82F6', '#10B981', '#F59E0B'][
                    metrics.volumeByMethod.indexOf(item) % 3
                  ]
                }))}
                height={300}
                centerText={{
                  primary: '3',
                  secondary: 'Methods'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="purchase">Purchases</option>
                <option value="refund">Refunds</option>
                <option value="payout">Payouts</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* Export transactions */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
                title="Export Transactions"
              >
                <IconDownload className="h-5 w-5" />
              </button>
              <button
                onClick={() => {/* Refresh data */}}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 rounded-lg"
                title="Refresh"
              >
                <IconRefresh className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.id}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 
                          flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                          {transaction.customer.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.customer.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${transaction.type === 'purchase'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : transaction.type === 'refund'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                    {transaction.course && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {transaction.course.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium
                      ${transaction.type === 'refund' 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {transaction.type === 'refund' ? '-' : ''}
                      ${transaction.amount.toFixed(2)}
                    </div>
                    {transaction.processingFee > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +${transaction.processingFee.toFixed(2)} fee
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : transaction.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <IconCreditCard className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.paymentMethod.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        {transaction.paymentMethod.last4 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ****{transaction.paymentMethod.last4}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {/* View details */}}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 
                          dark:hover:text-gray-300"
                      >
                        <IconEye className="h-5 w-5" />
                      </button>
                      <div className="relative group">
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 
                          dark:hover:text-gray-300"
                        >
                          <IconDots className="h-5 w-5" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md 
                          shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scale-0 
                          group-hover:scale-100 transition-transform origin-top-right z-10"
                        >
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 
                                dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {/* View receipt */}}
                            >
                              View Receipt
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 
                                dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {/* Process refund */}}
                            >
                              Process Refund
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 
                                dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {/* Delete transaction */}}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredTransactions.length} of {transactions.length} transactions
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

export default TransactionsDashboard;