"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheDotPlotChart.module.scss";
import { ApacheDotPlotChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ScatterChart,
  CanvasRenderer,
]);

const ApacheDotPlotChart: React.FC<ApacheDotPlotChartProps> = ({
  title = "Dot Plot Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Generate unique colors for each data point
  const colorPalette = [
    "#E63946", "#F4A261", "#2A9D8F", "#264653", "#8E44AD",
    "#3498DB", "#E67E22", "#DFFF00", "#FF69B4", "#FFD700",
  ];

  const categories = [...new Set(data.map((item) => item.x))];

  // Assign a color to each data point
  const seriesData = data.map((item, index) => ({
    name: `${xAxisLabel}: ${item.x}<br/>${yAxisLabel}: ${item.value}`,
    type: "scatter",
    symbolSize: 10,
    data: [[item.x, item.value]],
    itemStyle: { color: colorPalette[index % colorPalette.length] },
  }));

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent tooltip background
      borderColor: (params: any) => params.color, // Tooltip border matches dot color
      textStyle: { color: "#FFF" },
      formatter: (params: any) => `
        <b style="color: ${params.color}">●</b> ${params.seriesName}
      `,
    },
    legend: { show: false },
    grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      name: xAxisLabel,
      data: categories,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      nameLocation: "center",
      nameGap: 30,
      nameTextStyle: { fontSize: 14, color: isDark ? "#FFFFFF" : "#333" },
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      nameLocation: "center",
      nameGap: 50,
      nameTextStyle: { fontSize: 14, color: isDark ? "#FFFFFF" : "#333" },
    },
    series: seriesData,
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheDotPlotChart;
