// src/components/charts/base/DonutChart.tsx
import React, { useState, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from 'recharts';
import { motion } from 'framer-motion';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerText?: string | {
    primary: string;
    secondary: string;
  };
  showLegend?: boolean;
  showTooltip?: boolean;
  showLabels?: boolean;
  currency?: boolean;
  interactive?: boolean;
  animate?: boolean;
}

const COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'],
  success: ['#10B981', '#059669', '#34D399', '#6EE7B7'],
  warning: ['#F59E0B', '#D97706', '#FBBF24', '#FCD34D'],
  error: ['#EF4444', '#DC2626', '#F87171', '#FCA5A5'],
  gray: ['#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB']
};

const renderActiveShape = (props: any) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
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
        d={`M${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#888"
        className="text-sm"
      >
        {`${payload.name} (${(percent * 100).toFixed(1)}%)`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#333"
        className="text-sm font-medium"
      >
        {value.toLocaleString()}
      </text>
    </g>
  );
};

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height = 400,
  innerRadius = 60,
  outerRadius = 80,
  centerText,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  currency = false,
  interactive = true,
  animate = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = useCallback(
    (_: any, index: number) => {
      if (interactive) {
        setActiveIndex(index);
      }
    },
    [interactive]
  );

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
            {(payload[0].payload.percent * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      className="w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={showLabels ? renderActiveShape : undefined}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={() => setActiveIndex(-1)}
            animationBegin={0}
            animationDuration={animate ? 1500 : 0}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS.primary[index % COLORS.primary.length]}
                className="transition-opacity duration-200"
                style={{
                  opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.6,
                }}
              />
            ))}
          </Pie>

          {showTooltip && <Tooltip content={<CustomTooltip />} />}

          {showLegend && (
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{
                paddingLeft: '10%',
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      {centerText && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ marginTop: height / 2 - 20 }}
        >
          {typeof centerText === 'string' ? (
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              {centerText}
            </p>
          ) : (
            <>
              <p className="text-gray-900 dark:text-white text-2xl font-bold">
                {centerText.primary}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {centerText.secondary}
              </p>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Usage example:
const data = [
  { name: 'Category A', value: 400, color: '#3B82F6' },
  { name: 'Category B', value: 300, color: '#10B981' },
  { name: 'Category C', value: 300, color: '#F59E0B' },
  { name: 'Category D', value: 200, color: '#EF4444' },
];

<DonutChart 
  data={data}
  height={400}
  centerText={{
    primary: '$1,200',
    secondary: 'Total Revenue'
  }}
  currency
  showLabels
  interactive
/>