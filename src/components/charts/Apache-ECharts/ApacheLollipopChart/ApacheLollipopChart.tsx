"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { ScatterChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheLollipopChart.module.scss";
import { ApacheLollipopChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ScatterChart,
  LineChart,
  CanvasRenderer,
]);

const ApacheLollipopChart: React.FC<ApacheLollipopChartProps> = ({
  title = "Lollipop Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const categories = data.map((item) => item.x);
  const values = data.map((item) => item.value);
  const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#C70039"];

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
        let point = params[1]; // The scatter (lollipop) point
        return `
          <div style="border:2px solid ${point.color}; padding:5px; border-radius:5px;">
            <b>Category:</b> ${point.name} <br/>
            <b>Value:</b> ${point.value}
          </div>
        `;
      },
    },
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
      nameGap: 40,
    },
    series: [
      {
        name: "Lollipop Sticks",
        type: "line",
        symbol: "none",
        lineStyle: { color: "#999", width: 2 },
        data: values.map((v, i) => [categories[i], v]),
      },
      {
        name: "Lollipops",
        type: "scatter",
        symbolSize: 12,
        itemStyle: { color: (params: any) => colors[params.dataIndex % colors.length] },
        data: values.map((v, i) => [categories[i], v]),
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheLollipopChart;
