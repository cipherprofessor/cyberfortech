"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheBoxplotChart.module.scss";
import { useEffect, useState } from "react";
import { ApacheBoxplotChartProps } from "../common/types";

const ApacheBoxplotChart: React.FC<ApacheBoxplotChartProps> = ({
  title = "Boxplot Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colors = ["#FF7043", "#42A5F5", "#66BB6A", "#FFCA28", "#AB47BC"];

  const chartData =
    data || [
      [655, 850, 940, 980, 1070],
      [760, 800, 845, 865, 930],
      [740, 780, 810, 870, 920],
      [680, 720, 760, 800, 850],
      [690, 740, 790, 810, 870],
    ];

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },

    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },

    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#333" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    xAxis: {
      type: "category",
      name: xAxisLabel, // Dynamically set X-axis label
      nameLocation: "middle",
      nameGap: 30,
      data: ["A", "B", "C", "D", "E"],
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      nameTextStyle: { fontSize: 14, fontWeight: "bold", color: isDark ? "#EAEAEA" : "#333" },
    },

    yAxis: {
      type: "value",
      name: yAxisLabel, // Dynamically set Y-axis label
      nameLocation: "middle",
      nameGap: 50,
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
      nameTextStyle: { fontSize: 14, fontWeight: "bold", color: isDark ? "#EAEAEA" : "#333" },
    },

    series: [
      {
        name: "Boxplot",
        type: "boxplot",
        data: chartData.map((item, index) => ({
          value: item,
          itemStyle: {
            borderColor: colors[index % colors.length],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[index % colors.length] },
                { offset: 1, color: "rgba(255,255,255,0.5)" },
              ],
            },
          },
        })),
        emphasis: {
          itemStyle: {
            borderColor: "#FF4081",
            color: "rgba(255, 64, 129, 0.5)",
          },
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

export default ApacheBoxplotChart;
