"use client";

import React from "react";
import * as echarts from "echarts/core";
import "echarts-gl"; // Import ECharts GL for 3D support
import { useTheme } from "next-themes";
import ReactECharts from "echarts-for-react";
import { Apache3DSurfaceChartProps } from "../common/types";
import styles from "./Apache3DSurfaceChart.module.scss";

const Apache3DSurfaceChart: React.FC<Apache3DSurfaceChartProps> = ({
  title = "3D Surface Chart",
  data = [],
}) => {
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
      show: true,
      dimension: 2,
      min: -1,
      max: 1,
      inRange: {
        color: ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"],
      },
    },
    xAxis3D: { type: "category" },
    yAxis3D: { type: "category" },
    zAxis3D: { type: "value" },
    grid3D: {
      viewControl: { autoRotate: true },
      boxWidth: 200,
      boxDepth: 80,
    },
    series: [
      {
        type: "surface3D",
        data,
        shading: "realistic",
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Apache3DSurfaceChart;
