import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheChordChart.module.scss";
import { ApacheChordChartProps } from "../common/types";

const ApacheChordChart: React.FC<ApacheChordChartProps> = ({
  title = "Chord Diagram",
  data = [],
  links = [],
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    series: [
      {
        type: "graph",
        layout: "circular",
        circular: { rotateLabel: true },
        label: { show: true, position: "right", color: isDark ? "#FFF" : "#000" },
        data: data.map((node) => ({
          name: node.name,
          value: node.value,
          symbolSize: Math.max(10, node.value * 1.5),
          itemStyle: { color: node.color || "#FF5733" }, // Unique color for each node
        })),
        links: links.map((link) => ({
          source: link.source,
          target: link.target,
          value: link.value,
          lineStyle: {
            color: link.color || "#999",
            width: Math.max(1, link.value / 2),
            curveness: 0.3, // Curved links for a chord-like effect
          },
        })),
        emphasis: {
          focus: "adjacency",
          label: { show: true },
        },
        roam: true, // Enables zoom & pan
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheChordChart;
