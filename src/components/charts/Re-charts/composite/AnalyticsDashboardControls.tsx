// src/components/charts/composite/AnalyticsDashboardControls.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconFileExport,
  IconCalendar,
  IconFilter,
  IconRefresh,
  IconChevronDown
} from '@tabler/icons-react';
import { chartAnimations } from '../utils/animations';

interface FilterOption {
  label: string;
  value: string;
}

interface TimeFrame {
  label: string;
  value: string;
  range: number; // in days
}

interface AnalyticsDashboardControlsProps {
  onExport: (format: 'csv' | 'png' | 'svg') => void;
  onTimeFrameChange: (timeFrame: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onRefresh?: () => void;
  selectedTimeFrame: string;
  filters: Record<string, string[]>;
  filterOptions: Record<string, FilterOption[]>;
  timeFrames: TimeFrame[];
  loading?: boolean;
  showRefresh?: boolean;
}

export const AnalyticsDashboardControls: React.FC<AnalyticsDashboardControlsProps> = ({
  onExport,
  onTimeFrameChange,
  onFilterChange,
  onRefresh,
  selectedTimeFrame,
  filters,
  filterOptions,
  timeFrames,
  loading = false,
  showRefresh = true,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const exportMenuRef = React.useRef<HTMLDivElement>(null);

  // Close export menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div 
      className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      {...chartAnimations.container}
    >
      {/* Time Frame Selection */}
      <div className="flex items-center gap-2">
        <IconCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <div className="flex gap-1">
          {timeFrames.map((frame) => (
            <motion.button
              key={frame.value}
              onClick={() => onTimeFrameChange(frame.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedTimeFrame === frame.value
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {frame.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {Object.keys(filterOptions).length > 0 && (
        <div className="flex items-center gap-4">
          <IconFilter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key} className="relative">
              <select
                value={filters[key]?.[0] || ''}
                onChange={(e) => onFilterChange({ ...filters, [key]: [e.target.value] })}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  appearance-none pr-8"
              >
                <option value="">All {key}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IconChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Refresh Button */}
        {showRefresh && (
          <motion.button
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        )}

        {/* Export Options */}
        <div className="relative" ref={exportMenuRef}>
          <motion.button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconFileExport className="w-4 h-4" />
            Export
            <IconChevronDown className={`w-4 h-4 transition-transform duration-200 
              ${showExportMenu ? 'rotate-180' : ''}`} />
          </motion.button>

          {showExportMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                border border-gray-200 dark:border-gray-700 z-10"
            >
              {['csv', 'png', 'svg'].map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    onExport(format as 'csv' | 'png' | 'svg');
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Export as {format.toUpperCase()}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Export the types for external use
export type { FilterOption, TimeFrame };