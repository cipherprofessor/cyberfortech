// src/components/charts/base/RadarChart.tsx
import React, { useState } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { chartColors, chartColorsArray } from '../config/colors';


interface DataPoint {
  subject: string;
  [key: string]: number | string;
}

interface Series {
  dataKey: string;
  name: string;
  color?: string;
  fillOpacity?: number;
}

interface RadarChartProps {
  data: DataPoint[];
  series: Series[];
  height?: number;
  gridOpacity?: number;
  enableAnimation?: boolean;
  showLegend?: boolean;
  interactive?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  series,
  height = 400,
  gridOpacity = 0.3,
  enableAnimation = true,
  showLegend = true,
  interactive = true,
}) => {
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [activeSeries, setActiveSeries] = useState<string[]>(
    series.map(s => s.dataKey)
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-medium mb-2">
            {payload[0].payload.subject}
          </p>
          {payload.map((entry: any, index: number) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleSeries = (seriesKey: string) => {
    if (interactive) {
      setActiveSeries(prev =>
        prev.includes(seriesKey)
          ? prev.filter(key => key !== seriesKey)
          : [...prev, seriesKey]
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
          {series.map(s => (
            <button
              key={s.dataKey}
              onClick={() => toggleSeries(s.dataKey)}
              onMouseEnter={() => setHoveredSeries(s.dataKey)}
              onMouseLeave={() => setHoveredSeries(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium 
                transition-all duration-200 ${
                activeSeries.includes(s.dataKey)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
              style={{
                backgroundColor: activeSeries.includes(s.dataKey) 
                  ? `${s.color}20` 
                  : undefined,
                color: activeSeries.includes(s.dataKey) 
                  ? s.color 
                  : undefined
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <PolarGrid 
            stroke="#374151" 
            opacity={gridOpacity} 
          />
          
          <PolarAngleAxis
            dataKey="subject"
            tick={{ 
              fill: '#6B7280',
              fontSize: 12
            }}
          />
          
          <PolarRadiusAxis
            angle={90}
            domain={[0, 'auto']}
            tick={{ 
              fill: '#6B7280',
              fontSize: 12
            }}
          />

          {series.map((s, index) => (
            activeSeries.includes(s.dataKey) && (
              <Radar
                key={s.dataKey}
                name={s.name}
                dataKey={s.dataKey}
                stroke={s.color || chartColorsArray[index % chartColorsArray.length]}
                fill={s.color || chartColorsArray[index % chartColorsArray.length]}
                fillOpacity={
                  hoveredSeries === null || hoveredSeries === s.dataKey
                    ? (s.fillOpacity || 0.5)
                    : (s.fillOpacity || 0.5) / 2
                }
                animationBegin={enableAnimation ? index * 300 : 0}
                animationDuration={enableAnimation ? 1500 : 0}
                animationEasing="ease-out"
              />
            )
          ))}

          {showLegend && (
            <Legend
              align="right"
              verticalAlign="middle"
              layout="vertical"
              wrapperStyle={{
                paddingLeft: '10px'
              }}
              onClick={(e) => e.dataKey && toggleSeries(e.dataKey.toString())}
              onMouseEnter={(e) => e.dataKey && setHoveredSeries(e.dataKey.toString())}
              onMouseLeave={() => setHoveredSeries(null)}
            />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Usage example:
const data = [
  { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Scalability', A: 86, B: 130, fullMark: 150 },
  { subject: 'Security', A: 99, B: 100, fullMark: 150 },
  { subject: 'Usability', A: 85, B: 90, fullMark: 150 },
];

const series = [
  { dataKey: 'A', name: 'Current', color: '#3B82F6', fillOpacity: 0.5 },
  { dataKey: 'B', name: 'Target', color: '#10B981', fillOpacity: 0.5 }
];

<RadarChart 
  data={data}
  series={series}
  height={400}
  enableAnimation={true}
  showLegend={true}
  interactive={true}
/>