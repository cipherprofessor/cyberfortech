'use client';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsDashboardControls } from './AnalyticsDashboardControls';
import { themes, getThemeColorWithOpacity } from '../config/themes';
import { chartAnimations } from '../utils/animations';
import { formatters } from '../utils/formatters';
import { IconLoader2 } from '@tabler/icons-react';

// Types
interface ChartDataPoint {
  [key: string]: any;
}

// Update the ChartSeries interface
interface ChartSeries {
  type: 'line' | 'area' | 'bar' | 'scatter';
  dataKey: string;
  name: string;
  color?: string;
  gradient?: boolean;
  yAxisId?: string;
  stackId?: string;
  hide?: boolean;
  curveType?: 'basis' | 'linear' | 'natural' | 'monotone' | 'step';
}

interface ReferenceValue {
  value: number;
  label: string;
  color?: string;
  yAxisId?: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface TimeFrame {
  label: string;
  value: string;
  range: number;
}

interface EnhancedAnalyticsDashboardChartProps {
  data: ChartDataPoint[];
  series: ChartSeries[];
  xAxisKey: string;
  height?: number;
  theme?: keyof typeof themes;
  currency?: boolean;
  references?: ReferenceValue[];
  title?: string;
  subtitle?: string;
  filterOptions?: Record<string, FilterOption[]>;
  timeFrames?: TimeFrame[];
  enableExport?: boolean;
  enableFilters?: boolean;
  enableTimeFrames?: boolean;
  onDataFiltered?: (filteredData: ChartDataPoint[]) => void;
  chartTypes?: ('line' | 'area' | 'bar' | 'scatter')[];
  loading?: boolean;
}

export const EnhancedAnalyticsDashboardChart: React.FC<EnhancedAnalyticsDashboardChartProps> = ({
  data,
  series,
  xAxisKey,
  height = 400,
  theme = 'light',
  currency = false,
  references = [],
  title,
  subtitle,
  filterOptions = {},
  timeFrames = [
    { label: '7D', value: '7d', range: 7 },
    { label: '1M', value: '1m', range: 30 },
    { label: '3M', value: '3m', range: 90 },
    { label: 'YTD', value: 'ytd', range: 365 },
    { label: '1Y', value: '1y', range: 365 },
    { label: 'All', value: 'all', range: 0 },
  ],
  enableExport = true,
  enableFilters = true,
  enableTimeFrames = true,
  onDataFiltered,
  chartTypes = ['line', 'area', 'bar', 'scatter'],
  loading = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('1m');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [activeSeriesKeys, setActiveSeriesKeys] = useState<string[]>(
    series.map(s => s.dataKey)
  );
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  const currentTheme = themes[theme];

  // Memoize processed data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply time frame filter
    if (selectedTimeFrame !== 'all') {
      const timeFrame = timeFrames.find(tf => tf.value === selectedTimeFrame);
      if (timeFrame) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeFrame.range);
        result = result.filter(item => new Date(item[xAxisKey]) >= cutoffDate);
      }
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0 && values[0] !== '') {
        result = result.filter(item => values.includes(String(item[key])));
      }
    });

    onDataFiltered?.(result);
    return result;
  }, [data, selectedTimeFrame, filters, timeFrames, xAxisKey, onDataFiltered]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {formatters.date(label)}
        </p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium text-gray-900 dark:text-white">
              {entry.name}:
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {currency
                ? formatters.currency(entry.value)
                : formatters.number(entry.value)}
            </span>
          </div>
        ))}
      </motion.div>
    );
  };

  // Handle series toggle
  const handleSeriesToggle = useCallback((dataKey: string) => {
    setActiveSeriesKeys(prev =>
      prev.includes(dataKey)
        ? prev.filter(key => key !== dataKey)
        : [...prev, dataKey]
    );
  }, []);

  // Render chart elements based on series type
  const renderChartElement = useCallback((item: ChartSeries) => {
    const isActive = activeSeriesKeys.includes(item.dataKey);
    const opacity = (hoveredSeries === null || hoveredSeries === item.dataKey) && isActive ? 1 : 0.3;

    // Separate key from common props
    const commonProps = {
      dataKey: item.dataKey,
      name: item.name,
      stroke: item.color || currentTheme.colors[0],
      fill: item.gradient 
        ? `url(#gradient-${item.dataKey})`
        : getThemeColorWithOpacity(item.color || currentTheme.colors[0], 0.1),
      opacity,
      yAxisId: item.yAxisId || '1',
      hide: !isActive,
      type: item.curveType || 'monotone' as const,
    };

    switch (item.type) {
      case 'line':
        return (
          <Line
            key={item.dataKey}
            {...commonProps}
            strokeWidth={2}
            dot={{ r: 3, fill: item.color || currentTheme.colors[0] }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        );
      case 'area':
        return (
          <Area
            key={item.dataKey}
            {...commonProps}
            strokeWidth={2}
            fillOpacity={0.3}
          />
        );
      case 'bar':
        return (
          <Bar
            key={item.dataKey}
            {...commonProps}
            radius={[4, 4, 0, 0]}
            barSize={20}
            fill={item.color || currentTheme.colors[0]}
          />
        );
      case 'scatter':
        return (
          <Scatter
            key={item.dataKey}
            {...commonProps}
            fill={item.color || currentTheme.colors[0]}
          />
        );
      default:
        return null;
    }
  }, [activeSeriesKeys, hoveredSeries, currentTheme.colors]);

  const handleExport = useCallback((format: 'csv' | 'png' | 'svg') => {
    // Implement export logic here
    // console.log(`Exporting as ${format}`);
  }, []);

  return (
    <div className="space-y-6" ref={chartRef}>
      {/* Controls */}
      {(enableExport || enableFilters || enableTimeFrames) && (
        <AnalyticsDashboardControls
          onExport={handleExport}
          onTimeFrameChange={setSelectedTimeFrame}
          onFilterChange={setFilters}
          selectedTimeFrame={selectedTimeFrame}
          filters={filters}
          filterOptions={filterOptions}
          timeFrames={timeFrames}
          loading={loading}
        />
      )}

      {/* Chart Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <IconLoader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              {/* Gradients */}
              <defs>
                {series.map((item) => {
                  if (!item.gradient) return null;
                  return (
                    <linearGradient
                      key={`gradient-${item.dataKey}`}
                      id={`gradient-${item.dataKey}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={item.color || currentTheme.colors[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={item.color || currentTheme.colors[0]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  );
                })}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={currentTheme.grid.line}
                opacity={currentTheme.grid.opacity}
              />

              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: currentTheme.text.label }}
                stroke={currentTheme.axis.line}
                tickFormatter={(value) => formatters.date(value)}
              />

              <YAxis
                yAxisId="1"
                tick={{ fill: currentTheme.text.label }}
                stroke={currentTheme.axis.line}
                tickFormatter={(value) => 
                  currency 
                    ? formatters.compact(value) 
                    : formatters.number(value)
                }
              />

              <YAxis
                yAxisId="2"
                orientation="right"
                tick={{ fill: currentTheme.text.label }}
                stroke={currentTheme.axis.line}
              />

              {references.map((ref, index) => (
                <ReferenceLine
                  key={`ref-${index}`}
                  y={ref.value}
                  yAxisId={ref.yAxisId || '1'}
                  stroke={ref.color || currentTheme.colors[0]}
                  strokeDasharray="3 3"
                  label={{
                    value: ref.label,
                    position: 'right',
                    fill: ref.color || currentTheme.colors[0],
                  }}
                />
              ))}

              <Tooltip content={<CustomTooltip />} />

              <Legend
                onClick={(e) => e.dataKey && handleSeriesToggle(String(e.dataKey))}
                onMouseEnter={(e) => e.dataKey && setHoveredSeries(String(e.dataKey))}
                onMouseLeave={() => setHoveredSeries(null)}
              />

              {series.map(renderChartElement)}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export type {
  ChartDataPoint,
  ChartSeries,
  ReferenceValue,
  FilterOption,
  TimeFrame,
  EnhancedAnalyticsDashboardChartProps
};