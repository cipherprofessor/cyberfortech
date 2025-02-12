"use client";

import React from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts/core";
import { SankeyChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ReactECharts from "echarts-for-react";
import styles from "./ApacheRibbonChart.module.scss";
import { ApacheRibbonChartProps } from "../common/types";

echarts.use([TitleComponent, TooltipComponent, GridComponent, SankeyChart, CanvasRenderer]);

const ApacheRibbonChart: React.FC<ApacheRibbonChartProps> = ({ title = "Ribbon Chart", data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Extract unique nodes from data
  const nodes = Array.from(new Set(data.flatMap(({ source, target }) => [source, target]))).map(
    (name) => ({ name })
  );

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
        if (params.dataType === "edge") {
          return `${params.data.source} → ${params.data.target}: <b>${params.data.value}</b>`;
        }
        return params.name;
      },
    },
    series: [
      {
        type: "sankey",
        layout: "none",
        emphasis: { focus: "adjacency" },
        data: nodes,
        links: data,
        lineStyle: {
          color: "source",
          curveness: 0.5,
        },
        label: {
          color: isDark ? "#FFFFFF" : "#000000",
          position: "inside",
        },
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheRibbonChart;
