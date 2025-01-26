// src/components/ui/Mine/FinanceDashboard/ReportGenerator.tsx
import React, { useState } from 'react';
import {
  IconFileSpreadsheet,
  IconFileAnalytics,
  IconPrinter,
  IconCalendar,
  IconFilter,
  IconDownload
} from '@tabler/icons-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'tax' | 'reconciliation' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
}

interface ReportGeneratorProps {
  onGenerate: (options: any) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onGenerate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState<Record<string, any>>({});

  const templates: ReportTemplate[] = [
    {
      id: 'financial-summary',
      name: 'Financial Summary',
      description: 'Complete financial overview with revenue, expenses, and profit analysis',
      type: 'financial',
      format: 'pdf'
    },
    {
      id: 'tax-report',
      name: 'Tax Report',
      description: 'Detailed tax calculations and records for accounting purposes',
      type: 'tax',
      format: 'excel'
    },
    {
      id: 'reconciliation',
      name: 'Payment Reconciliation',
      description: 'Match transactions with bank records and identify discrepancies',
      type: 'reconciliation',
      format: 'excel'
    },
    {
      id: 'revenue-analysis',
      name: 'Revenue Analysis',
      description: 'Deep dive into revenue streams and growth patterns',
      type: 'financial',
      format: 'pdf'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
      
      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
              ${selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
              <span className={`px-2 py-1 text-xs rounded-full
                ${template.type === 'financial'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : template.type === 'tax'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}
              >
                {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <IconFileSpreadsheet className="h-4 w-4 mr-1" />
              {template.format.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Date Range Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Range
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex-1">
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Filters
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
          >
            <option value="">All Payment Methods</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          <select
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
          >
            <option value="">All Currencies</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          onClick={() => onGenerate({ template: selectedTemplate, dateRange, filters })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <IconFileAnalytics className="h-4 w-4 mr-2" />
          Generate Report
        </button>
        <button
          onClick={() => {/* Preview functionality */}}
          className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
            text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <IconPrinter className="h-4 w-4 mr-2" />
          Preview
        </button>
      </div>
    </div>
  );
};