// src/components/charts/interactive/DrilldownChart.tsx
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { chartAnimations } from '../utils/animations';
import { ChartTooltip } from '../components/Tooltip';

interface DrilldownLevel {
  id: string;
  data: any[];
  parentId?: string;
}

interface DrilldownChartProps {
  levels: DrilldownLevel[];
  initialLevelId: string;
  height?: number;
  colors?: string[];
}

export const DrilldownChart: React.FC<DrilldownChartProps> = ({
  levels,
  initialLevelId,
  height = 400,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
}) => {
  const [currentLevelId, setCurrentLevelId] = useState(initialLevelId);
  const [drilldownPath, setDrilldownPath] = useState<string[]>([initialLevelId]);

  const currentLevel = levels.find(level => level.id === currentLevelId);

  const handleBarClick = (data: any) => {
    const nextLevel = levels.find(level => level.parentId === currentLevelId);
    if (nextLevel) {
      setCurrentLevelId(nextLevel.id);
      setDrilldownPath([...drilldownPath, nextLevel.id]);
    }
  };

  const handleBackClick = () => {
    if (drilldownPath.length > 1) {
      const newPath = [...drilldownPath];
      newPath.pop();
      setDrilldownPath(newPath);
      setCurrentLevelId(newPath[newPath.length - 1]);
    }
  };

  return (
    <motion.div
      className="w-full space-y-4"
      {...chartAnimations.container}
    >
      {drilldownPath.length > 1 && (
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg
            hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back to Previous Level
        </button>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={currentLevel?.data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Bar
            dataKey="value"
            fill={colors[drilldownPath.length - 1]}
            onClick={handleBarClick}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Usage example:
const levels = [
  {
    id: 'categories',
    data: [
      { name: 'Electronics', value: 1000 },
      { name: 'Clothing', value: 800 },
      { name: 'Books', value: 600 },
    ]
  },
  {
    id: 'electronics',
    parentId: 'categories',
    data: [
      { name: 'Phones', value: 400 },
      { name: 'Laptops', value: 350 },
      { name: 'Tablets', value: 250 },
    ]
  }
];

<DrilldownChart
  levels={levels}
  initialLevelId="categories"
  height={400}
/>