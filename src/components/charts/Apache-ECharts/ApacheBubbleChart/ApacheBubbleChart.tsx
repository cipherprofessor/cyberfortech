"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheBubbleChart.module.scss";
import { useEffect, useState } from "react";
import { ApacheBubbleChartProps } from "../common/types";

const ApacheBubbleChart: React.FC<ApacheBubbleChartProps> = ({
  title = "Bubble Chart",
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  data,
}) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colors = ["#90CAF9", "#A5D6A7", "#F48FB1", "#FFCC80", "#CE93D8"];

  const chartData =
    data ||
    [
      { x: 10, y: 20, size: 15 },
      { x: 20, y: 30, size: 25 },
      { x: 30, y: 10, size: 10 },
      { x: 40, y: 50, size: 30 },
      { x: 50, y: 40, size: 20 },
    ];

  const options = {
    backgroundColor: isDark ? "#121212" : "transparent", // Dark mode fix
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },

    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },

    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#333" : "#fff",
      borderColor: isDark ? "#444" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
      formatter: (params: any) => {
        const [x, y, size] = params.data;
        return `<b>${title}</b><br />
        <b>${xAxisLabel}:</b> ${x} <br />
        <b>${yAxisLabel}:</b> ${y} <br />
        <b>Size:</b> ${size}`;
      },
    },

    xAxis: {
      name: xAxisLabel,
      nameTextStyle: { color: isDark ? "#EAEAEA" : "#333" },
      type: "value",
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
    },

    yAxis: {
      name: yAxisLabel,
      nameTextStyle: { color: isDark ? "#EAEAEA" : "#333" },
      type: "value",
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    series: [
      {
        name: "Data Points",
        type: "scatter",
        symbolSize: (data: any) => data[2],
        data: chartData.map((item) => [item.x, item.y, item.size]),
        itemStyle: {
          color: (params: any) => colors[params.dataIndex % colors.length],
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.2)",
        },
        animationDuration: 800,
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApacheBubbleChart;
