import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApachePolarChart.module.scss";
import { ApachePolarChartProps } from "../common/types";

const ApachePolarChart: React.FC<ApachePolarChartProps> = ({
  title = "Polar Chart",
  data = [],
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = [
    "#FF5733", "#33FF57", "#3399FF", "#FF33A1", "#FFD700", "#FF4500",
    "#8A2BE2", "#00CED1", "#DC143C", "#FF8C00", "#4B0082", "#7FFF00"
  ];

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    textStyle: { color: isDark ? "#FFFFFF" : "#333" },

    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },

    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
      borderWidth: 2,
      textStyle: { color: isDark ? "#FFF" : "#333" },
      formatter: (params: any) => {
        return `
          <div style="border-left: 5px solid ${params.color}; padding-left: 8px;">
            <b style="color:${params.color}">${params.name}</b>: ${params.value}
          </div>
        `;
      },
    },

    angleAxis: {
      type: "category",
      data: data.map((item) => item[0]),
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#000000" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#000000" },
    },

    radiusAxis: {
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#000000" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#000000" },
    },

    polar: {},

    series: [
      {
        type: "bar",
        data: data.map((item, index) => ({
          value: item[1],
          itemStyle: { color: colors[index % colors.length] },
        })),
        coordinateSystem: "polar",
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default ApachePolarChart;
