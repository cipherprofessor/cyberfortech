"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { CustomChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApachePyramidChart.module.scss";
import { ApachePyramidChartProps } from "../common/types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CustomChart,
  CanvasRenderer,
]);

const ApachePyramidChart: React.FC<ApachePyramidChartProps> = ({
  title = "Pyramid Chart",
  data,
  xAxisLabel = "Categories",
  yAxisLabel = "Values",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const seriesData = data.map((item) => ({
    name: item.category,
    value: item.value,
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
      formatter: "{b}: {c}",
    },
    legend: {
      top: "10%",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    series: [
      {
        name: title,
        type: "funnel",
        sort: "descending",
        label: {
          show: true,
          position: "inside",
          color: isDark ? "#FFFFFF" : "#333",
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        data: seriesData,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApachePyramidChart;
