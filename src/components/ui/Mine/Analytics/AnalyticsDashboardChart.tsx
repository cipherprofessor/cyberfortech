"use client";
// src/components/charts/composite/AnalyticsDashboardChart.tsx
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';
import { chartColors } from '@/components/charts/config/colors';
import { ChartTooltip } from '@/components/charts/components/Tooltip';
import { chartGradients } from '@/components/charts/config/gradients';


interface Series {
  type: 'line' | 'bar' | 'area' | 'scatter';
  key: string;
  name: string;
  color?: string;
  gradient?: string;
  yAxisId?: string;
  stackId?: string;
  hide?: boolean;
}

interface Threshold {
  value: number;
  label: string;
  color?: string;
  yAxisId?: string;
}

interface AnalyticsDashboardChartProps {
  data: any[];
  series: Series[];
  xAxis: string;
  height?: number;
  currency?: boolean;
  formatter?: (value: any) => string;
  thresholds?: Threshold[];
  stacked?: boolean;
  interactive?: boolean;
}

export const AnalyticsDashboardChart = ({
  data,
  series,
  xAxis,
  height = 400,
  currency = false,
  formatter,
  thresholds = [],
  stacked = false,
  interactive = true,
}: AnalyticsDashboardChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [visibleSeries, setVisibleSeries] = useState<string[]>(
    series.filter(s => !s.hide).map(s => s.key)
  );
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  const toggleSeries = (dataKey: string) => {
    if (interactive) {
      setVisibleSeries(prev =>
        prev.includes(dataKey)
          ? prev.filter(key => key !== dataKey)
          : [...prev, dataKey]
      );
    }
  };

  const renderChartElement = (item: Series) => {
    if (!visibleSeries.includes(item.key)) return null;

    const commonProps = {
      key: item.key,
      type: "monotone" as const,
      dataKey: item.key,
      name: item.name,
      yAxisId: item.yAxisId || '1',
      stroke: item.color || chartColors.primary.base,
      fill: `url(#gradient-${item.key})`,
      stackId: stacked ? (item.stackId || 'stack') : undefined,
      opacity: hoveredSeries === null || hoveredSeries === item.key ? 1 : 0.3,
    };

    switch (item.type) {
      case 'line':
        return (
          <Line
            {...commonProps}
            strokeWidth={2}
            dot={{ fill: item.color || chartColors.primary.base }}
            activeDot={{ r: 8 }}
          />
        );
      case 'area':
        return (
          <Area
            {...commonProps}
            strokeWidth={2}
          />
        );
      case 'bar':
        return (
          <Bar
            {...commonProps}
            radius={[4, 4, 0, 0]}
          />
        );
      case 'scatter':
        return (
          <Scatter
            {...commonProps}
            fill={item.color || chartColors.primary.base}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {interactive && (
        <div className="flex flex-wrap gap-2">
          {series.map(item => (
            <button
              key={item.key}
              onClick={() => toggleSeries(item.key)}
              onMouseEnter={() => setHoveredSeries(item.key)}
              onMouseLeave={() => setHoveredSeries(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium 
                transition-all duration-200 ${
                visibleSeries.includes(item.key)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      <div className="w-full">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              {series.map(item => (
                <linearGradient
                  key={`gradient-${item.key}`}
                  id={`gradient-${item.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {(item.gradient ? chartGradients[item.gradient] : chartGradients.primary)
                    .map((stop, index) => (
                      <stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity}
                      />
                    ))}
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            
            <XAxis
              dataKey={xAxis}
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            
            <YAxis
              yAxisId="1"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            
            <YAxis
              yAxisId="2"
              orientation="right"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            
            <Tooltip content={
                <ChartTooltip currency={currency} formatter={formatter} />
              } />
              
              <Legend 
                onClick={(e) => e.dataKey && toggleSeries(e.dataKey as string)}
                onMouseEnter={(e) => e.dataKey && setHoveredSeries(e.dataKey as string)}
                onMouseLeave={() => setHoveredSeries(null)}
              />
              
              {thresholds.map((threshold, index) => (
                <ReferenceLine
                  key={`threshold-${index}`}
                  y={threshold.value}
                  yAxisId={threshold.yAxisId || '1'}
                  label={{
                    value: threshold.label,
                    position: 'right',
                    fill: threshold.color || '#EF4444'
                  }}
                  stroke={threshold.color || '#EF4444'}
                  strokeDasharray="3 3"
                />
              ))}
              
              {series.map(renderChartElement)}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };
  
  // Example usage:
  const data = [
    { 
      date: '2024-01',
      revenue: 4000,
      users: 2400,
      growth: 20,
      transactions: [{ x: 4000, y: 20 }]
    },
    // ... more data
  ];
  
  const series = [
    { 
      type: 'bar',
      key: 'revenue',
      name: 'Revenue',
      gradient: 'primary',
      yAxisId: '1'
    },
    { 
      type: 'line',
      key: 'growth',
      name: 'Growth %',
      color: '#10B981',
      yAxisId: '2'
    },
    { 
      type: 'area',
      key: 'users',
      name: 'Users',
      gradient: 'success',
      yAxisId: '1'
    },
    { 
      type: 'scatter',
      key: 'transactions',
      name: 'Transactions',
      color: '#8B5CF6',
      yAxisId: '1'
    }
  ];
  
  const thresholds = [
    {
      value: 3000,
      label: 'Target Revenue',
      color: '#EF4444',
      yAxisId: '1'
    }
  ];
  
//   <AnalyticsDashboardChart 
//     data={data}
//     series={series}
//     xAxis="date"
//     currency
//     thresholds={thresholds}
//     stacked={false}
//     interactive={true}
//   />