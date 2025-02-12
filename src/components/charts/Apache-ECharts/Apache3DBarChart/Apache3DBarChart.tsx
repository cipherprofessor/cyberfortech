"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { GridComponent, VisualMapComponent } from "echarts/components";
// import { Bar3DChart } from "echarts-gl/charts"; // Correct Import
import { CanvasRenderer } from "echarts/renderers";
import "echarts-gl"; // Import ECharts GL
import { Bar3DChartProps } from "../common/types";
import styles from "./Apache3DBarChart.module.scss";
import ReactECharts from "echarts-for-react";

// ✅ REGISTER REQUIRED COMPONENTS
echarts.use([GridComponent, VisualMapComponent, CanvasRenderer]);

const Apache3DBarChart: React.FC<Bar3DChartProps> = ({ title = "3D Bar Chart", data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {},
    visualMap: {
      max: 100,
      inRange: { color: ["#f2c31a", "#24b7f2"] },
    },
    xAxis3D: { type: "category", data: data.map((d) => d.x) },
    yAxis3D: { type: "category", data: data.map((d) => d.y) },
    zAxis3D: { type: "value" },
    grid3D: { boxWidth: 200, boxDepth: 80, viewControl: { autoRotate: true } },
    series: [
      {
        type: "bar3D",
        data: data.map((d) => [d.x, d.y, d.z]),
        shading: "lambert",
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Apache3DBarChart;
