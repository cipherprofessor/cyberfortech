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
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';
import { chartGradients } from '../config/gradients';
// import { chartColors, chartGradients } from '../config';

interface BarChartProps {
  data: any[];
  bars: {
    key: string;
    name: string;
    color?: string;
    gradient?: string;
    stackId?: string;
  }[];
  xAxis: string;
  height?: number;
  currency?: boolean;
  formatter?: (value: any) => string;
  stacked?: boolean;
  vertical?: boolean;
  animationDuration?: number;
  showGrid?: boolean;
  rounded?: boolean;
  interactive?: boolean;
}

export const BarChart = ({
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
}: BarChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  const handleMouseEnter = (_: any, index: React.SetStateAction<number>) => {
    if (interactive) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setActiveIndex(-1);
    }
  };

  return (
    <motion.div 
      className="w-full transition-transform duration-300 hover:scale-[1.02]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout={vertical ? 'vertical' : 'horizontal'}
        >
          <defs>
            {bars.map(bar => (
              <linearGradient
                key={`gradient-${bar.key}`}
                id={`gradient-${bar.key}`}
                x1="0"
                y1="0"
                x2={vertical ? "0" : "1"}
                y2={vertical ? "1" : "0"}
              >
                {(bar.gradient ? chartGradients[bar.gradient] : chartGradients.primary)
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
          
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              opacity={0.1} 
            />
          )}
          
          {vertical ? (
            <>
              <YAxis
                dataKey={xAxis}
                type="category"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#374151', opacity: 0.3 }}
              />
              <XAxis
                type="number"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#374151', opacity: 0.3 }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xAxis}
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#374151', opacity: 0.3 }}
              />
              <YAxis
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#374151', opacity: 0.3 }}
              />
            </>
          )}
          
          <Tooltip content={
            <ChartTooltip currency={currency} formatter={formatter} />
          } />
          
          <Legend />
          
          {bars.map(bar => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={`url(#gradient-${bar.key})`}
              stackId={stacked ? bar.stackId || 'stack' : undefined}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
              radius={rounded ? [4, 4, 0, 0] : 0}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fillOpacity={activeIndex === -1 || activeIndex === index ? 1 : 0.6}
                  className="transition-all duration-300"
                />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Usage example:
const data = [
  { category: 'A', value1: 100, value2: 80 },
  { category: 'B', value1: 200, value2: 150 },
  // ...more data
];

const bars = [
  { key: 'value1', name: 'Value 1', gradient: 'primary' },
  { key: 'value2', name: 'Value 2', gradient: 'success' }
];

<BarChart 
  data={data}
  bars={bars}
  xAxis="category"
  currency
  stacked={false}
  vertical={false}
  rounded
/>