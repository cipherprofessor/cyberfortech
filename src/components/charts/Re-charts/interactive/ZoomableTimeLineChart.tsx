// src/components/charts/interactive/ZoomableTimelineChart.tsx
import React, { useState, useEffect } from 'react';
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
  Brush,
  ReferenceArea
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartTooltip } from '../components/Tooltip';
import { ZoomableTimelineChartProps, DataPoint, SeriesConfig } from '../types/chart-types';



export const ZoomableTimelineChart: React.FC<ZoomableTimelineChartProps> = ({
  data,
  series,
  xAxis,
  height = 400,
  currency = false,
  formatter
}) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [leftDomain, setLeftDomain] = useState<string | null>(null);
  const [rightDomain, setRightDomain] = useState<string | null>(null);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  const handleZoom = () => {
    if (refAreaLeft && refAreaRight) {
      setLeftDomain(refAreaLeft);
      setRightDomain(refAreaRight);
      setRefAreaLeft(null);
      setRefAreaRight(null);
    }
  };

  const handleMouseDown = (e: any) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
    }
  };

  const handleMouseMove = (e: any) => {
    if (refAreaLeft && e && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleReset = () => {
    setLeftDomain(null);
    setRightDomain(null);
  };

  const renderSeriesItem = (item: SeriesConfig) => {
    const commonProps = {
      name: item.name,
      stroke: item.color,
      fill: item.gradient ? `url(#${item.gradient})` : item.color,
      dataKey: item.key,
      // Only add yAxisId if it's specified
      ...(item.yAxisId && { yAxisId: item.yAxisId })
    };

    switch (item.type) {
      case 'line':
        return (
          <Line
            key={item.key}
            {...commonProps}
            strokeWidth={2}
            dot={{ fill: item.color }}
            activeDot={{ r: 8 }}
          />
        );
      case 'bar':
        return (
          <Bar
            key={item.key}
            {...commonProps}
            radius={[4, 4, 0, 0]}
          />
        );
      case 'area':
        return (
          <Area
            key={item.key}
            {...commonProps}
            strokeWidth={2}
            fillOpacity={0.3}
          />
        );
      default:
        return null;
    }
  };

  // Check if we need a right axis
  const hasRightAxis = series.some(item => item.yAxisId === 'right');

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleZoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxis}
            domain={[leftDomain || 'dataMin', rightDomain || 'dataMax']}
          />
          <YAxis yAxisId="left" /> {/* Default left axis */}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" />} {/* Optional right axis */}
          <Tooltip content={<ChartTooltip currency={currency} formatter={formatter} />} />
          <Legend />
          <Brush dataKey={xAxis} height={30} stroke="#8884d8" />

          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          )}

          {series.map(renderSeriesItem)}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};