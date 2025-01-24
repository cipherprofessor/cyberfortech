// src/components/charts/base/PieChart.tsx
import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from 'recharts';
import { motion } from 'framer-motion';
import { chartColors, chartColorsArray } from '../config/colors';
// import { chartColors } from '../config';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  enableActiveSegment?: boolean;
  showLegend?: boolean;
  currency?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

// Custom Active Shape for better hover effect
const renderActiveShape = (props: any) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="text-sm"
      >
        {`${payload.name}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        className="text-xs"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 400,
  enableActiveSegment = true,
  showLegend = true,
  currency = false,
  innerRadius = 0,
  outerRadius = 80,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = (_: any, index: number) => {
    if (enableActiveSegment) {
      setActiveIndex(index);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-medium">
            {payload[0].name}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {currency ? '$' : ''}{payload[0].value.toLocaleString()}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {(payload[0].payload.percent * 100).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={enableActiveSegment ? renderActiveShape : undefined}
            onMouseEnter={onPieEnter}
            onMouseLeave={() => setActiveIndex(-1)}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || chartColorsArray[index % chartColorsArray.length]}
                className="transition-opacity duration-200"
                style={{
                  opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.6,
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Export DonutChart as a configured PieChart
export const DonutChart: React.FC<Omit<PieChartProps, 'innerRadius'>> = (props) => (
  <PieChart {...props} innerRadius={60} />
);

// Usage examples:
const data = [
  { name: 'Category A', value: 400, color: '#3B82F6' },
  { name: 'Category B', value: 300, color: '#10B981' },
  { name: 'Category C', value: 300, color: '#F59E0B' },
  { name: 'Category D', value: 200, color: '#EF4444' },
];

{/* <PieChart data={data} currency height={400} />
<DonutChart data={data} currency height={400} /> */}