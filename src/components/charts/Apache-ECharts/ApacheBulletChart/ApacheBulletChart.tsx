"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheBulletChart.module.scss";
import { ApacheBulletChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  BarChart,
  CanvasRenderer,
]);

const ApacheBulletChart: React.FC<ApacheBulletChartProps> = ({
  title = "Bullet Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Performance",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const categories = data.map((item) => item.category);
  const actualValues = data.map((item) => item.actual);
  const targetValues = data.map((item) => item.target);

  // 🎨 Unique colors for bars
  const colors = ["#3498DB", "#E74C3C", "#F1C40F", "#2ECC71", "#9B59B6"];

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        return `
          <b>${params[0].axisValue}</b><br/>
          <span style="color:${params[0].color}">●</span> Actual: <b>${params[0].value}</b><br/>
          <span style="color:${params[1].color}">●</span> Target: <b>${params[1].value}</b>
        `;
      },
    },
    grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "value",
      name: xAxisLabel,
      nameLocation: "center",
      nameGap: 30,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#333", fontWeight: "bold" },
    },
    yAxis: {
      type: "category",
      name: yAxisLabel,
      nameLocation: "center",
      nameGap: 50,
      data: categories,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#333", fontWeight: "bold" },
    },
    series: [
      {
        name: "Actual",
        type: "bar",
        data: actualValues.map((value, index) => ({
          value,
          itemStyle: { color: colors[index % colors.length] },
        })),
        barWidth: 15,
      },
      {
        name: "Target",
        type: "bar",
        data: targetValues.map((value, index) => ({
          value,
          itemStyle: { color: colors[(index + 1) % colors.length] },
        })),
        barWidth: 15,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheBulletChart;
