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
import { chartAnimations } from '../utils/animations';


interface BrushChartProps {
  data: any[];
  series: {
    type: 'line' | 'bar' | 'area';
    key: string;
    name: string;
    color?: string;
    yAxisId?: string;
  }[];
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

  const handleBrushChange = (domain: any) => {
    setBrushDomain(domain);
  };

  return (
    <motion.div
      className="w-full"
      {...chartAnimations.container}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip content={<ChartTooltip />} />
          <Legend />

          {series.map(item => {
            const commonProps = {
              
              type: "monotone" as const,
              dataKey: item.key,
              name: item.name,
              stroke: item.color,
              fill: item.color,
              yAxisId: item.yAxisId || '1',
            };

            switch (item.type) {
              case 'line':
                return <Line {...commonProps} type="monotone" dot={false} />;
              case 'bar':
                return <Bar {...commonProps} />;
              case 'area':
                return <Area {...commonProps} />;
              default:
                return null;
            }
          })}

          <Brush
            dataKey={xAxisKey}
            height={brushHeight}
            stroke="#8884d8"
            startIndex={brushDomain[0]}
            endIndex={brushDomain[1]}
            onChange={handleBrushChange}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
