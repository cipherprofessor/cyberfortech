"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheStackedAreaChart.module.scss";
import { ApacheStackedAreaChartProps } from "../common/types";

// Define colors for each metric
const metricColors: Record<string, string> = {
  Revenue: "#4CAF50", // Green
  Expenses: "#F44336", // Red
  Profit: "#2196F3", // Blue
};

const ApacheStackedAreaChart: React.FC<ApacheStackedAreaChartProps> = ({
  title = "",
  data = [],
  xAxisLabel = "",
  yAxisLabel = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data.length) return <div>No data available</div>;

  // Extract keys dynamically except 'x'
  const keys = Object.keys(data[0]).filter((key) => key !== "x");

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#333" : "#fff",
      borderColor: "#ddd",
      borderWidth: 1,
      textStyle: { color: isDark ? "#fff" : "#333" },
      formatter: (params: any) => {
        let tooltipContent = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((param: any) => {
          tooltipContent += `
            <span style="display:inline-block;width:10px;height:10px;background-color:${
              metricColors[param.seriesName] || "#999"
            };margin-right:5px;border-radius:50%;"></span>
            ${param.seriesName}: <strong>${param.value}</strong><br/>`;
        });
        return tooltipContent;
      },
    },
    legend: {
      data: keys,
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    xAxis: {
      type: "category",
      data: data.map((d) => d.x),
      name: xAxisLabel, // **Reusable X-Axis Label**
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
    },
    yAxis: {
      type: "value",
      name: yAxisLabel, // **Reusable Y-Axis Label**
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
    },
    series: keys.map((key) => ({
      name: key,
      type: "line",
      stack: "total",
      areaStyle: {},
      itemStyle: { color: metricColors[key] || "#999" },
      data: data.map((d) => d[key]),
    })),
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheStackedAreaChart;
