"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheAreaChart.module.scss";
import { areaChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheAreaChart = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colorsLight = ["#42A5F5", "#66BB6A", "#FFA726"];
  const colorsDark = ["#1E88E5", "#43A047", "#FB8C00"];

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#E0E0E0" : "#333" },

    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderWidth: 2,
      borderColor: isDark ? "#555" : "#ccc",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    legend: {
      bottom: 10,
      textStyle: { color: isDark ? "#E0E0E0" : "#333" },
      formatter: (name: string) => {
        const item = areaChartData.find((d) => d.name === name);
        return item ? `${name}: ${item.values[item.values.length - 1]}` : name;
      },
      selectedMode: "multiple",
    },

    xAxis: {
      type: "category",
      data: areaChartData[0].labels,
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#E0E0E0" : "#333" },
    },

    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#E0E0E0" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    series: areaChartData.map((dataset, index) => ({
      name: dataset.name,
      type: "line",
      smooth: true,
      data: dataset.values,
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: isDark ? colorsDark[index] + "88" : colorsLight[index] + "88" },
            { offset: 1, color: "transparent" },
          ],
        },
      },
      itemStyle: {
        color: isDark ? colorsDark[index] : colorsLight[index],
        borderColor: isDark ? colorsDark[index] : colorsLight[index],
      },
      lineStyle: {
        width: 2.5,
        shadowBlur: 6,
        shadowColor: "rgba(0,0,0,0.2)",
      },
      emphasis: {
        focus: "series",
        scale: 1.08,
      },
      animationDuration: 1000,
    })),
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApacheAreaChart;
