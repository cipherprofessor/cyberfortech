"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ApacheStreamGraphData } from "../common/types";

interface ApacheStreamGraphChartProps {
  data: ApacheStreamGraphData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  lightColors?: string[];
  darkColors?: string[];
}

const ApacheStreamGraphChart: React.FC<ApacheStreamGraphChartProps> = ({
  data,
  xAxisLabel = "Months",
  yAxisLabel = "Sales",
  lightColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"], // Light mode colors
  darkColors = ["#FFB74D", "#81C784", "#64B5F6", "#E57373"], // Dark mode colors
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect system dark mode
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", listener);

    return () => darkModeMediaQuery.removeEventListener("change", listener);
  }, []);

  if (data.length === 0) return <p>No data available</p>;

  const categories = Object.keys(data[0]).filter((key) => key !== "x");

  const option = {
    backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: { color: isDarkMode ? "#fff" : "#000" },
    },
    legend: {
      data: categories,
      textStyle: { color: isDarkMode ? "#fff" : "#000" },
      top: 20,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.x),
      name: xAxisLabel,
      nameLocation: "center",
      nameGap: 40, // Centering the label
      nameTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        color: isDarkMode ? "#fff" : "#000",
      },
      axisLabel: { color: isDarkMode ? "#ccc" : "#333" },
      axisLine: { lineStyle: { color: isDarkMode ? "#777" : "#ccc" } },
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      nameLocation: "center",
      nameRotate: 90, // Rotate to match Y axis
      nameGap: 50, // Centering the label
      nameTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        color: isDarkMode ? "#fff" : "#000",
      },
      axisLabel: { color: isDarkMode ? "#ccc" : "#333" },
      axisLine: { lineStyle: { color: isDarkMode ? "#777" : "#ccc" } },
    },
    series: categories.map((category, index) => ({
      name: category,
      type: "line",
      stack: "total",
      areaStyle: {},
      emphasis: { focus: "series" },
      data: data.map((item) => Number(item[category])),
      color: isDarkMode ? darkColors[index % darkColors.length] : lightColors[index % lightColors.length],
    })),
  };

  return <ReactECharts option={option} style={{ height: "400px" }} />;
};

export default ApacheStreamGraphChart;
