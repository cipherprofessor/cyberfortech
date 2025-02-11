"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { HeatmapChartProps } from "../common/types";
import styles from "./ApacheHeatmapChart.module.scss";
import { heatmapChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheHeatmapChart: React.FC<HeatmapChartProps> = ({ title }) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    
    tooltip: {
      position: "top",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#444" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 20,
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },

    xAxis: {
      type: "category",
      data: heatmapChartData.xLabels,
      splitArea: { show: true },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
    },

    yAxis: {
      type: "category",
      data: heatmapChartData.yLabels,
      splitArea: { show: true },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
    },

    series: [
      {
        name: "Heat Intensity",
        type: "heatmap",
        data: heatmapChartData.data,
        label: { show: true, color: "#fff" },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0, 0, 0, 0.5)" },
        },
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <ReactECharts option={options} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default ApacheHeatmapChart;
