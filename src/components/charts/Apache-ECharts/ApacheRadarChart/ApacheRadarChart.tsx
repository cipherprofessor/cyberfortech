"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheRadarChart.module.scss";
import { radarChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheRadarChart = () => {
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
      formatter: (name: string) => {
        const item = radarChartData.series.find((d) => d.name === name);
        return item ? `${name}: ${Math.max(...item.data)}` : name;
      },
      selectedMode: "multiple",
    },

    radar: {
      indicator: radarChartData.categories.map((category) => ({
        name: category,
        max: 100,
      })),
      splitLine: {
        lineStyle: { color: isDark ? "#444" : "#DDD" },
      },
      splitArea: {
        show: true,
        areaStyle: { color: ["rgba(255, 255, 255, 0.1)", "transparent"] },
      },
      axisLine: {
        lineStyle: { color: isDark ? "#AAA" : "#333" },
      },
    },

    series: [
      {
        name: "Radar Data",
        type: "radar",
        data: radarChartData.series.map((dataset, index) => ({
          value: dataset.data,
          name: dataset.name,
          itemStyle: {
            color: isDark ? colorsDark[index] : colorsLight[index],
            borderColor: isDark ? colorsDark[index] : colorsLight[index],
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: isDark ? colorsDark[index] + "88" : colorsLight[index] + "88" },
                { offset: 1, color: "transparent" },
              ],
            },
          },
        })),
        emphasis: {
          focus: "series",
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

export default ApacheRadarChart;
