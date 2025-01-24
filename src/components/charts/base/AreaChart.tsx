// src/components/charts/base/AreaChart.tsx
import React, { useState, useEffect } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';
import { chartGradients } from '../config/gradients';
import { chartColors } from '../config/colors';


interface AreaChartProps {
  data: any[];
  areas: {
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
  animationDuration?: number;
  showGrid?: boolean;
}

export const AreaChart = ({
  data,
  areas,
  xAxis,
  height = 300,
  currency = false,
  formatter,
  stacked = false,
  animationDuration = 1000,
  showGrid = true,
}: AreaChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <motion.div 
      className="w-full transition-transform duration-300 hover:scale-[1.02]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {areas.map(area => (
              <linearGradient
                key={`gradient-${area.key}`}
                id={`gradient-${area.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {(area.gradient ? chartGradients[area.gradient] : chartGradients.primary)
                  .map((stop, index) => (
                    <stop
                      key={index}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={hoveredArea === area.key ? stop.opacity + 0.2 : stop.opacity}
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
          
          <Tooltip content={
            <ChartTooltip currency={currency} formatter={formatter} />
          } />
          
          <Legend 
            onMouseEnter={(e) => e.dataKey && setHoveredArea(e.dataKey.toString())}
            onMouseLeave={() => setHoveredArea(null)}
          />
          
          {areas.map(area => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={area.color || chartColors.primary.base}
              fill={`url(#gradient-${area.key})`}
              strokeWidth={2}
              stackId={stacked ? area.stackId || 'stack' : undefined}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
              onMouseEnter={() => setHoveredArea(area.key)}
              onMouseLeave={() => setHoveredArea(null)}
              style={{
                filter: hoveredArea === area.key ? 'brightness(1.1)' : 'none',
                transition: 'filter 0.3s ease'
              }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Usage example:
const data = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  // ...more data
];

const areas = [
  { key: 'revenue', name: 'Revenue', gradient: 'primary' },
  { key: 'profit', name: 'Profit', gradient: 'success' }
];

<AreaChart 
  data={data}
  areas={areas}
  xAxis="month"
  currency
  stacked={false}
/>