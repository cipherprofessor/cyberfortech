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
import { chartGradients } from '../config/gradients';
import { chartColors } from '../config/colors';
// import { chartColors, chartGradients } from '../config';

interface LineChartProps {
  data: any[];
  lines: {
    key: string;
    name: string;
    color?: string;
    gradient?: string;
  }[];
  xAxis: string;
  height?: number;
  currency?: boolean;
  formatter?: (value: any) => string;
  animationDuration?: number;
}

export const LineChart = ({
  data,
  lines,
  xAxis,
  height = 300,
  currency = false,
  formatter,
  animationDuration = 1000
}: LineChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="w-full transition-transform duration-300 hover:scale-[1.02]">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {lines.map(line => (
              <linearGradient
                key={`gradient-${line.key}`}
                id={`gradient-${line.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {(line.gradient ? chartGradients[line.gradient] : chartGradients.primary)
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
          
          {lines.map(line => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={`url(#gradient-${line.key})`}
              strokeWidth={3}
              dot={{ 
                fill: line.color || chartColors.primary.base, 
                strokeWidth: 2 
              }}
              activeDot={{ 
                r: 8, 
                fill: line.color || chartColors.primary.base 
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