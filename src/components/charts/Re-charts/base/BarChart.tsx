// src/components/charts/base/BarChart.tsx
import React, { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';

// Types
interface DataPoint {
  [key: string]: string | number;
}

interface BarConfig {
  key: string;
  name: string;
  gradient?: keyof typeof defaultGradients;
  color?: string;
}

interface GradientStop {
  offset: string;
  color: string;
  opacity: number;
}

interface GradientConfig {
  [key: string]: GradientStop[];
}

interface BarChartProps {
  data: DataPoint[];
  bars: BarConfig[];
  xAxis: string;
  height?: number;
  currency?: boolean;
  formatter?: (value: number) => string;
  stacked?: boolean;
  vertical?: boolean;
  animationDuration?: number;
  showGrid?: boolean;
  rounded?: boolean;
  interactive?: boolean;
}

// Define default gradients
const defaultGradients: GradientConfig = {
  primary: [
    { offset: '0%', color: '#3B82F6', opacity: 0.8 },
    { offset: '100%', color: '#2563EB', opacity: 0.3 },
  ],
  success: [
    { offset: '0%', color: '#10B981', opacity: 0.8 },
    { offset: '100%', color: '#059669', opacity: 0.3 },
  ],
  error: [
    { offset: '0%', color: '#EF4444', opacity: 0.8 },
    { offset: '100%', color: '#DC2626', opacity: 0.3 },
  ],
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxis,
  height = 300,
  currency = false,
  formatter,
  stacked = false,
  vertical = false,
  animationDuration = 1000,
  showGrid = true,
  rounded = true,
  interactive = true,
}) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {bars.map((bar: BarConfig) => (
              <linearGradient
                key={`gradient-${bar.key}`}
                id={`gradient-${bar.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {(bar.gradient && defaultGradients[bar.gradient] 
                  ? defaultGradients[bar.gradient] 
                  : defaultGradients.primary).map((stop: GradientStop, stopIndex: number) => (
                  <stop
                    key={stopIndex}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            ))}
          </defs>

          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              opacity={0.1} 
            />
          )}

          <XAxis
            dataKey={xAxis}
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#374151', opacity: 0.3 }}
          />

          <YAxis
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#374151', opacity: 0.3 }}
          />

          <Tooltip content={<ChartTooltip currency={currency} formatter={formatter} />} />
          <Legend />

          {bars.map((bar: BarConfig, index: number) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              stackId={stacked ? 'stack' : undefined}
              fill={`url(#gradient-${bar.key})`}
              radius={rounded ? [4, 4, 0, 0] : 0}
              maxBarSize={60}
              animationDuration={animationDuration}
              onMouseEnter={() => interactive && setActiveIndex(index)}
              onMouseLeave={() => interactive && setActiveIndex(-1)}
              opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.3}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};