"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheScatterChart.module.scss";
import { scatterChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheScatterChart = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colorsLight = ["#42A5F5", "#66BB6A", "#FFA726", "#AB47BC", "#FF7043"];
  const colorsDark = ["#1E88E5", "#43A047", "#FB8C00", "#8E24AA", "#D84315"];

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#E0E0E0" : "#333" },

    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderWidth: 2,
      borderColor: isDark ? "#555" : "#ccc",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    legend: {
      bottom: 10,
      textStyle: { color: isDark ? "#E0E0E0" : "#333" },
      selectedMode: "multiple",
    },

    xAxis: {
      type: "value",
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    series: [
      {
        name: "Data Points",
        type: "scatter",
        data: scatterChartData,
        symbolSize: 10,
        itemStyle: {
          color: (params: { dataIndex: number }) => (isDark ? colorsDark[params.dataIndex % colorsDark.length] : colorsLight[params.dataIndex % colorsLight.length]),
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.3)",
        },
        emphasis: {
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
        animationDuration: 1000,
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApacheScatterChart;
