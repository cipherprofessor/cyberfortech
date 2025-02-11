// src/components/charts/composite/RadarDashboardChart.tsx
import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';
import { chartColors } from '../config/colors';


interface MetricGroup {
  key: string;
  name: string;
  color?: string;
}

interface RadarDashboardChartProps {
  data: any[];
  metrics: MetricGroup[];
  height?: number;
  formatter?: (value: any) => string;
  gridOpacity?: number;
  fillOpacity?: number;
  interactive?: boolean;
}

export const RadarDashboardChart = ({
  data,
  metrics,
  height = 400,
  formatter,
  gridOpacity = 0.3,
  fillOpacity = 0.5,
  interactive = true,
}: RadarDashboardChartProps) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<string[]>(
    metrics.map(m => m.key)
  );

  const toggleMetric = (metricKey: string) => {
    if (interactive) {
      setActiveMetrics(prev =>
        prev.includes(metricKey)
          ? prev.filter(key => key !== metricKey)
          : [...prev, metricKey]
      );
    }
  };

  return (
    <motion.div 
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {interactive && (
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              onMouseEnter={() => setHoveredMetric(metric.key)}
              onMouseLeave={() => setHoveredMetric(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium 
                transition-all duration-200 ${
                activeMetrics.includes(metric.key)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {metric.name}
            </button>
          ))}
        </div>
      )}

      <div className="w-full">
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <PolarGrid 
              stroke="#374151" 
              opacity={gridOpacity} 
            />
            
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#6B7280' }}
            />
            
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'auto']}
              tick={{ fill: '#6B7280' }}
            />

            {metrics.map(metric => (
              activeMetrics.includes(metric.key) && (
                <Radar
                  key={metric.key}
                  name={metric.name}
                  dataKey={metric.key}
                  stroke={metric.color || chartColors.primary.base}
                  fill={metric.color || chartColors.primary.base}
                  fillOpacity={
                    hoveredMetric === null || hoveredMetric === metric.key 
                      ? fillOpacity 
                      : fillOpacity / 2
                  }
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              )
            ))}

            <Legend
              onClick={(e) => {
                if (e.dataKey) {
                  toggleMetric(e.dataKey as string);
                }
              }}
              onMouseEnter={(e) => e.dataKey && setHoveredMetric(e.dataKey as string)}
              onMouseLeave={() => setHoveredMetric(null)}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Example usage:
const data = [
  { subject: 'Revenue', A: 120, B: 110, fullMark: 150 },
  { subject: 'Users', A: 98, B: 130, fullMark: 150 },
  { subject: 'Engagement', A: 86, B: 130, fullMark: 150 },
  { subject: 'Retention', A: 99, B: 100, fullMark: 150 },
  { subject: 'Growth', A: 85, B: 90, fullMark: 150 },
  { subject: 'Satisfaction', A: 65, B: 85, fullMark: 150 },
];

const metrics = [
  { key: 'A', name: 'Current Period', color: '#3B82F6' },
  { key: 'B', name: 'Previous Period', color: '#10B981' }
];

<RadarDashboardChart 
  data={data}
  metrics={metrics}
  interactive={true}
/>