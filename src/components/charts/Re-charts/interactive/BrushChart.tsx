// src/components/charts/interactive/BrushChart.tsx
import React, { useState } from 'react';
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
  Brush
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';

interface DataPoint {
  [key: string]: string | number;
}

interface SeriesConfig {
  type: 'line' | 'bar' | 'area';
  key: string;
  name: string;
  color?: string;
  yAxisId?: 'left' | 'right';
}

interface BrushChartProps {
  data: DataPoint[];
  series: SeriesConfig[];
  xAxisKey: string;
  height?: number;
  brushHeight?: number;
  startIndex?: number;
  endIndex?: number;
}

export const BrushChart: React.FC<BrushChartProps> = ({
  data,
  series,
  xAxisKey,
  height = 400,
  brushHeight = 50,
  startIndex = 0,
  endIndex,
}) => {
  const [brushDomain, setBrushDomain] = useState([startIndex, endIndex || data.length - 1]);

  const handleBrushChange = (newIndex: { startIndex?: number; endIndex?: number }) => {
    if (newIndex.startIndex !== undefined && newIndex.endIndex !== undefined) {
      setBrushDomain([newIndex.startIndex, newIndex.endIndex]);
    }
  };

  const renderSeriesItem = (item: SeriesConfig) => {
    // Separate props from key for proper React handling
    const baseProps = {
      dataKey: item.key,
      name: item.name,
      stroke: item.color,
      fill: item.color,
      yAxisId: item.yAxisId || 'left'
    };

    switch (item.type) {
      case 'line':
        return (
          <Line
            key={item.key}
            {...baseProps}
            strokeWidth={2}
            dot={{ fill: item.color }}
            activeDot={{ r: 8 }}
          />
        );
      case 'bar':
        return (
          <Bar
            key={item.key}
            {...baseProps}
            radius={[4, 4, 0, 0]}
          />
        );
      case 'area':
        return (
          <Area
            key={item.key}
            {...baseProps}
            strokeWidth={2}
            fillOpacity={0.3}
          />
        );
      default:
        return null;
    }
  };

  const hasRightAxis = series.some(item => item.yAxisId === 'right');

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: hasRightAxis ? 30 : 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            opacity={0.1} 
          />
          
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#374151', opacity: 0.3 }}
          />
          
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#374151', opacity: 0.3 }}
          />
          
          {hasRightAxis && (
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
          )}
          
          <Tooltip content={<ChartTooltip />} />
          <Legend />

          {series.map(renderSeriesItem)}

          <Brush
            dataKey={xAxisKey}
            height={brushHeight}
            stroke="#8884d8"
            startIndex={brushDomain[0]}
            endIndex={brushDomain[1]}
            onChange={handleBrushChange}
            travellerWidth={10}
            fill="#1F2937"
            fillOpacity={0.1}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};