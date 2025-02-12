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
  TransformComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheHistogramChart.module.scss";
import { ApacheHistogramChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  CanvasRenderer,
]);

const ApacheHistogramChart: React.FC<ApacheHistogramChartProps> = ({
  title = "Histogram Chart",
  data,
  xAxisLabel = "Bins",
  yAxisLabel = "Frequency",
  barWidth = 30,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bins = data.map((item) => item.bin);
  const frequencies = data.map((item) => item.frequency);

  // Generate dynamic colors
  const barColors = [
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#FFC300",
    "#DAF7A6",
    "#C70039",
    "#900C3F",
  ];

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
        let item = params[0];
        return `
          <div style="border-left: 5px solid ${item.color}; padding: 5px;">
            <b>${item.axisValue}</b><br/>
            Frequency: <b>${item.value}</b>
          </div>
        `;
      },
    },
    grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      name: xAxisLabel,
      nameLocation: "center",
      nameGap: 30,
      data: bins,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#333", fontWeight: "bold" },
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      nameLocation: "center",
      nameGap: 50,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#333" },
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#333", fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        name: "Frequency",
        data: frequencies.map((value, index) => ({
          value,
          itemStyle: { color: barColors[index % barColors.length] },
        })),
        barWidth,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheHistogramChart;
