"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { ApacheGroupedBarChartProps } from "../common/types";
import styles from "./ApacheGroupedBarChart.module.scss";

const ApacheGroupedBarChart: React.FC<ApacheGroupedBarChartProps> = ({
  title = "Grouped Bar Chart",
  data = [],
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Extract categories (x-axis) and series dynamically
  const categories = data.map((d) => d.x);
  const keys = Object.keys(data[0] || {}).filter((key) => key !== "x");

  // Prepare series dynamically
  const series = keys.map((key) => ({
    name: key,
    type: "bar",
    data: data.map((d) => d[key]),
    emphasis: { focus: "series" },
  }));

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: { top: "5%", textStyle: { color: isDark ? "#FFFFFF" : "#333" } },
    xAxis: {
      type: "category",
      data: categories,
      name: xAxisLabel,
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
    },
    grid: { left: "10%", right: "10%", bottom: "15%" },
    series,
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheGroupedBarChart;
