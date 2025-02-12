"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import {
  BarChart,
  BarSeriesOption,
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheStackedBarChart.module.scss";
import { ApacheStackedBarChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  DatasetComponent,
  CanvasRenderer,
]);

const ApacheStackedBarChart: React.FC<ApacheStackedBarChartProps> = ({
  title = "Stacked Bar Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Extract categories & series
  const categories = data.map((item) => item.x);
  const seriesNames = Object.keys(data[0]).filter((key) => key !== "x");

  const seriesData = seriesNames.map((name) => ({
    name,
    type: "bar",
    stack: "total",
    emphasis: { focus: "series" },
    data: data.map((item) => item[name] as number),
  }));

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
        let tooltipContent = `<b>${params[0].axisValue}</b><br/>`;
        params.forEach((item: any) => {
          tooltipContent += `<span style="display:inline-block;width:10px;height:10px;margin-right:5px;background:${item.color};"></span>
            ${item.seriesName}: <b>${item.value}</b><br/>`;
        });
        return tooltipContent;
      },
    },
    legend: { top: 30, textStyle: { color: isDark ? "#FFFFFF" : "#333" } },
    grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      name: xAxisLabel,
      data: categories,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#333" } },
    },
    series: seriesData,
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheStackedBarChart;
