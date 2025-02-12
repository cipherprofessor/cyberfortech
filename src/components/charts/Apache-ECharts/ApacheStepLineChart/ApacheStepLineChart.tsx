"use client";

import React from "react";
import * as echarts from "echarts/core";
import { useTheme } from "next-themes";
import ReactECharts from "echarts-for-react";
import { ApacheStepLineChartProps } from "../common/types";
import styles from "./ApacheStepLineChart.module.scss";

const ApacheStepLineChart: React.FC<ApacheStepLineChartProps> = ({
  title = "Step Line Chart",
  data = [],
  xAxisLabel = "Time", // Default X-Axis label
  yAxisLabel = "Value", // Default Y-Axis label
  metricUnit = "", // Unit to display in tooltip
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
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const dataPoint = params[0];
        return `${xAxisLabel}: <b>${dataPoint.axisValue}</b><br/>
                ${yAxisLabel}: <b>${dataPoint.value}${metricUnit}</b>`;
      },
    },
    xAxis: {
      type: "category",
      name: xAxisLabel,
      nameLocation: "middle",
      nameGap: 25,
      data: data.map((d) => d.x),
    },
    yAxis: {
      type: "value",
      name: yAxisLabel,
      nameLocation: "middle",
      nameGap: 40,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    series: [
      {
        name: yAxisLabel,
        type: "line",
        step: "middle",
        data: data.map((d) => d.y),
        smooth: false,
        lineStyle: { width: 2 },
        itemStyle: { color: "#ff9800" },
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default ApacheStepLineChart;
