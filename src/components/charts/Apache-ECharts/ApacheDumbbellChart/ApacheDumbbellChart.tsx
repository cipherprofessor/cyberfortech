"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { ScatterChart, LineChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  TitleComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheDumbbellChart.module.scss";
import { ApacheDumbbellChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ScatterChart,
  LineChart,
  DatasetComponent,
  CanvasRenderer,
]);

const ApacheDumbbellChart: React.FC<ApacheDumbbellChartProps> = ({
  title = "Dumbbell Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const categories = data.map((item) => item.x);
  const colors = [
    "#FF5733", "#33FF57", "#337BFF", "#FF33D4", "#FFC733",
    "#8D33FF", "#33FFF1", "#FF3333", "#33FF8D", "#338DFF",
  ];

  const scatterData: any[] = [];
  const lineData: any[] = [];

  data.forEach((item, index) => {
    const keys = Object.keys(item).filter((key) => key !== "x");
    for (let i = 0; i < keys.length - 1; i++) {
      const start = item[keys[i]];
      const end = item[keys[i + 1]];
      const color = colors[index % colors.length];

      scatterData.push({
        name: `${keys[i]} - ${keys[i + 1]}`,
        type: "scatter",
        symbolSize: 12,
        itemStyle: { color },
        data: [
          [categories.indexOf(item.x), start],
          [categories.indexOf(item.x), end],
        ],
      });

      lineData.push({
        type: "line",
        data: [
          [categories.indexOf(item.x), start],
          [categories.indexOf(item.x), end],
        ],
        lineStyle: { color, width: 2 },
        symbol: "none",
      });
    }
  });

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        return `<div style="border: 2px solid ${params.color}; padding: 5px;">
          <b>${categories[params.data[0]]}</b><br/>
          ${params.seriesName}: <b>${params.data[1]}</b>
        </div>`;
      },
      backgroundColor: "rgba(255,255,255,0.9)",
      borderWidth: 2,
      textStyle: { color: "#333" },
    },
    grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      name: xAxisLabel,
      data: categories,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      nameLocation: "center",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      nameLocation: "center",
      nameGap: 50,
    },
    series: [...scatterData, ...lineData],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheDumbbellChart;
