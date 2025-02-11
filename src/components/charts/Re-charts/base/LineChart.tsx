// src/components/charts/base/LineChart.tsx
import React, { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';

// Types
interface DataPoint {
  [key: string]: string | number;
}

interface LineConfig {
  key: string;
  name: string;
  color?: string;
  gradient?: keyof typeof defaultGradients;
}

interface GradientStop {
  offset: string;
  color: string;
  opacity: number;
}

interface GradientConfig {
  [key: string]: GradientStop[];
}

interface LineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxis: string;
  height?: number;
  currency?: boolean;
  formatter?: (value: number) => string;
  animationDuration?: number;
}

// Default gradients
const defaultGradients: GradientConfig = {
  primary: [
    { offset: '0%', color: '#3B82F6', opacity: 0.8 },
    { offset: '100%', color: '#2563EB', opacity: 0.3 },
  ],
  success: [
    { offset: '0%', color: '#10B981', opacity: 0.8 },
    { offset: '100%', color: '#059669', opacity: 0.3 },
  ],
  warning: [
    { offset: '0%', color: '#F59E0B', opacity: 0.8 },
    { offset: '100%', color: '#D97706', opacity: 0.3 },
  ],
  error: [
    { offset: '0%', color: '#EF4444', opacity: 0.8 },
    { offset: '100%', color: '#DC2626', opacity: 0.3 },
  ],
};

// Default colors
const defaultColors = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxis,
  height = 300,
  currency = false,
  formatter,
  animationDuration = 1000
}) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  const getGradientStops = (line: LineConfig): GradientStop[] => {
    if (line.gradient && defaultGradients[line.gradient]) {
      return defaultGradients[line.gradient];
    }
    return defaultGradients.primary;
  };

  const getLineColor = (line: LineConfig): string => {
    return line.color || defaultColors.primary;
  };

  return (
    <div className="w-full transition-transform duration-300 hover:scale-[1.02]">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {lines.map((line: LineConfig) => (
              <linearGradient
                key={`gradient-${line.key}`}
                id={`gradient-${line.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {getGradientStops(line).map((stop: GradientStop, index: number) => (
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
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            opacity={0.1} 
          />
          
          <XAxis
            dataKey={xAxis}
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
          
          {lines.map((line: LineConfig) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={`url(#gradient-${line.key})`}
              strokeWidth={3}
              dot={{ 
                fill: getLineColor(line), 
                strokeWidth: 2 
              }}
              activeDot={{ 
                r: 8, 
                fill: getLineColor(line)
              }}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};