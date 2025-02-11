"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheBarChart.module.scss";
import { barChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheBarChart = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colors = ["#A5D6A7", "#90CAF9", "#CE93D8", "#FFCC80", "#B0BEC5", "#F48FB1"];

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },

    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#333" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    legend: {
      orient: "horizontal",
      bottom: 10,
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },

    xAxis: {
      type: "category",
      data: barChartData.map((item) => item.label),
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
    },

    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    series: [
      {
        name: "Revenue",
        type: "bar",
        data: barChartData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[index % colors.length] },
                { offset: 1, color: "#E0E0E0" },
              ],
            },
            borderRadius: [3, 3, 0, 0],
            shadowBlur: 5,
            shadowColor: "rgba(0,0,0,0.1)",
          },
        })),
        barWidth: "50%",
        emphasis: { scale: 1.05 },
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

export default ApacheBarChart;
