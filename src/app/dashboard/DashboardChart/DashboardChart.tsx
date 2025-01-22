"use client"
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import styles from './DashboardChart.module.scss';

const timeRanges = ['Week', 'Month', 'Year'] as const;
type TimeRange = typeof timeRanges[number];

export function DashboardChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Week');

  // Sample data - replace with real data in production
  const weeklyData = [
    { day: 'Mon', study: 2.5, progress: 85 },
    { day: 'Tue', study: 3.2, progress: 88 },
    { day: 'Wed', study: 1.8, progress: 82 },
    { day: 'Thu', study: 4.0, progress: 90 },
    { day: 'Fri', study: 2.7, progress: 86 },
    { day: 'Sat', study: 3.5, progress: 89 },
    { day: 'Sun', study: 2.9, progress: 87 },
  ];

  const monthlyData = [
    // Generate monthly data
    ...Array.from({ length: 30 }, (_, i) => ({
      day: `${i + 1}`,
      study: 2 + Math.random() * 3,
      progress: 80 + Math.random() * 15,
    })),
  ];

  const yearlyData = [
    // Generate yearly data (by month)
    { month: 'Jan', study: 45, progress: 82 },
    { month: 'Feb', study: 52, progress: 85 },
    { month: 'Mar', study: 48, progress: 83 },
    { month: 'Apr', study: 55, progress: 87 },
    { month: 'May', study: 50, progress: 85 },
    { month: 'Jun', study: 58, progress: 89 },
    { month: 'Jul', study: 54, progress: 88 },
    { month: 'Aug', study: 60, progress: 90 },
    { month: 'Sep', study: 56, progress: 89 },
    { month: 'Oct', study: 62, progress: 91 },
    { month: 'Nov', study: 58, progress: 90 },
    { month: 'Dec', study: 65, progress: 92 },
  ];

  const getData = () => {
    switch (selectedRange) {
      case 'Week':
        return weeklyData;
      case 'Month':
        return monthlyData;
      case 'Year':
        return yearlyData;
    }
  };

  const getXAxisKey = () => {
    switch (selectedRange) {
      case 'Week':
        return 'day';
      case 'Month':
        return 'day';
      case 'Year':
        return 'month';
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h2>Learning Analytics</h2>
        <div className={styles.timeRanges}>
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`${styles.rangeButton} ${
                selectedRange === range ? styles.active : ''
              }`}
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={getData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey={getXAxisKey()} 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="#666"
              fontSize={12}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="study"
              name="Study Hours"
              stroke="#007bff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="progress"
              name="Progress %"
              stroke="#28a745"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}