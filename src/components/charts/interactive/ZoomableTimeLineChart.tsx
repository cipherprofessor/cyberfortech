// src/components/charts/interactive/ZoomableTimelineChart.tsx
import React, { useState, useEffect } from 'react';
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
  Brush,
  ReferenceArea
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';
import { chartGradients } from '../config/gradients';
import { chartColors } from '../config/colors';
// import { chartColors, chartGradients } from '../config';

interface ZoomableTimelineChartProps {
  data: any[];
  series: {
    type: 'line' | 'bar' | 'area';
    key: string;
    name: string;
    color?: string;
    gradient?: string;
    yAxisId?: string;
  }[];
  xAxis: string;
  height?: number;
  currency?: boolean;
  formatter?: (value: any) => string;
}

export const ZoomableTimelineChart = ({
  data,
  series,
  xAxis,
  height = 400,
  currency = false,
  formatter
}: ZoomableTimelineChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [leftDomain, setLeftDomain] = useState<string | null>(null);
  const [rightDomain, setRightDomain] = useState<string | null>(null);
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomHistory, setZoomHistory] = useState<[string, string][]>([]);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  const handleMouseDown = (e: any) => {
    if (!e) return;
    setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (!e) return;
    if (refAreaLeft) setRefAreaRight(e.activeLabel);
  };

  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight) {
      // Save current domain for undo
      if (leftDomain && rightDomain) {
        setZoomHistory([...zoomHistory, [leftDomain, rightDomain]]);
      }

      // Update zoom
      setLeftDomain(refAreaLeft);
      setRightDomain(refAreaRight);
    }
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const handleUndo = () => {
    if (zoomHistory.length) {
      const prevDomain = zoomHistory[zoomHistory.length - 1];
      setLeftDomain(prevDomain[0]);
      setRightDomain(prevDomain[1]);
      setZoomHistory(zoomHistory.slice(0, -1));
    } else {
      setLeftDomain(null);
      setRightDomain(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg 
            border border-gray-200 dark:border-gray-700 
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors duration-200"
          disabled={!leftDomain && !rightDomain}
        >
          Reset Zoom
        </button>
      </div>

      <motion.div 
        className="w-full transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
                    .map((stop: { offset: string | number | undefined; color: string | undefined; opacity: string | number | undefined; }, index: React.Key | null | undefined) => (
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
              domain={leftDomain && rightDomain ? [leftDomain, rightDomain] : ['auto', 'auto']}
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            
            <YAxis
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            
            <Tooltip content={
              <ChartTooltip currency={currency} formatter={formatter} />
            } />
            
            <Legend />
            
            <Brush 
              dataKey={xAxis}
              height={30}
              stroke={chartColors.primary.base}
              fill="#ffffff"
            />
            
            {series.map(item => {
              const commonProps = {
                key: item.key,
                type: "monotone" as const,
                dataKey: item.key,
                name: item.name,
                yAxisId: item.yAxisId || '1',
                stroke: item.color || chartColors.primary.base,
                fill: `url(#gradient-${item.key})`,
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
                default:
                  return null;
              }
            })}

            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                yAxisId="1"
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill={chartColors.primary.light}
                fillOpacity={0.3}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

// Usage example:
const data = [
  { date: '2024-01', revenue: 4000, users: 2400, growth: 20 },
  { date: '2024-02', revenue: 3000, users: 1398, growth: 15 },
  // ... more data
];

const series = [
  { type: 'line', key: 'growth', name: 'Growth %', color: '#10B981' },
  { type: 'bar', key: 'revenue', name: 'Revenue', gradient: 'primary' },
  { type: 'area', key: 'users', name: 'Users', gradient: 'success' }
];

{/* <ZoomableTimelineChart 
  data={data}
  series={series}
  xAxis="date"
  currency
/> */}