"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { BoxplotChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheViolinChart.module.scss";
import { ApacheViolinChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BoxplotChart,
  DataZoomComponent,
  CanvasRenderer,
]);

const ApacheViolinChart: React.FC<ApacheViolinChartProps> = ({
  title = "Violin Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Define a color palette for different sticks
  const colorPalette = [
    "#FF5733",
    "#33FF57",
    "#337BFF",
    "#FFC300",
    "#8D33FF",
    "#FF33A1",
    "#33FFF6",
    "#FF8C33",
  ];

  // Extracting categories
  const categories = data.map((item) => item.x);
  const seriesData = data.map((item, index) => ({
    name: item.x,
    value: item.values,
    itemStyle: {
      color: colorPalette[index % colorPalette.length],
      borderColor: colorPalette[index % colorPalette.length], // 🔹 Same color for border & fill
      borderWidth: 2,
    },
  }));

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "item",
      borderWidth: 2,
      formatter: (params: any) => {
        const { name, value, color } = params;
        return `
          <div style="border: 2px solid ${color}; padding: 6px; border-radius: 4px;">
            <b>${name}</b><br/>
            Min: ${value[0]}<br/>
            Q1: ${value[1]}<br/>
            Median: ${value[2]}<br/>
            Q3: ${value[3]}<br/>
            Max: ${value[4]}
          </div>
        `;
      },
    },
    xAxis: {
      type: "category",
      name: xAxisLabel,
      data: categories,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      nameLocation: "center",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      nameLocation: "center",
      nameGap: 40,
    },
    series: [
      {
        name: "Violin",
        type: "boxplot",
        data: seriesData,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheViolinChart;
