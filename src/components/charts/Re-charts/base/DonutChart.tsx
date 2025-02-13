import React, { useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector
} from 'recharts';
import { motion } from 'framer-motion';
import { IconChartPie } from '@tabler/icons-react';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
    icon?: React.ReactNode;
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
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-lg"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
      <path
        d={`M${mx},${my}L${ex},${ey}`}
        stroke={fill}
        strokeWidth={2}
        fill="none"
        className="drop-shadow-sm"
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" className="drop-shadow-md" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        className="text-sm fill-gray-600 dark:fill-gray-300"
      >
        {`${payload.name} (${(percent * 100).toFixed(1)}%)`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        className="text-sm font-medium fill-gray-800 dark:fill-gray-100"
      >
        {value.toLocaleString()}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const color = payload[0].payload.color || COLORS.primary[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
        style={{ border: `2px solid ${color}` }}
      >
        <div className="flex items-center gap-2">
          {payload[0].payload.icon}
          <p className="text-gray-900 dark:text-white font-medium">
            {payload[0].name}
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {currency ? '$' : ''}{payload[0].value.toLocaleString()}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {(payload[0].payload.percent * 100).toFixed(1)}%
        </p>
      </motion.div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload, activeIndex, onMouseEnter, onMouseLeave } = props;
  
  return (
    <ul className="flex flex-col gap-2">
      {payload.map((entry: any, index: number) => (
        <motion.li
          key={`legend-${index}`}
          className="flex items-center gap-2 cursor-pointer"
          onMouseEnter={() => onMouseEnter(entry, index)}
          onMouseLeave={onMouseLeave}
          whileHover={{ scale: 1.02 }}
          animate={{
            opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.6
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.payload.icon}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({entry.payload.value.toLocaleString()})
          </span>
        </motion.li>
      ))}
    </ul>
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

  return (
    <motion.div
      className="w-full relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4"
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
            paddingAngle={3}
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
                className="transition-all duration-300 drop-shadow-lg"
                style={{
                  opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.6,
                  filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                }}
              />
            ))}
          </Pie>

          {showTooltip && (
            <Tooltip
              content={<CustomTooltip currency={currency} />}
              position={{ y: -10 }}
            />
          )}

          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  activeIndex={activeIndex}
                  onMouseEnter={(entry: any, index: number) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                />
              }
              verticalAlign="middle"
              align="right"
              layout="vertical"
              wrapperStyle={{
                paddingLeft: '10%',
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {centerText && (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
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
        </motion.div>
      )}
    </motion.div>
  );
};