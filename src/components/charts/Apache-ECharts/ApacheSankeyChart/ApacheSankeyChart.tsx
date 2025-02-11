import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheSankeyChart.module.scss";
import { ApacheSankeyChartProps } from "../common/types";

const ApacheSankeyChart: React.FC<ApacheSankeyChartProps> = ({
  title = "Sankey Diagram",
  data,
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
    },

    series: [
      {
        type: "sankey",
        layout: "none",
        emphasis: { focus: "adjacency" },
        data: data.nodes,
        links: data.links,
        itemStyle: { borderWidth: 1, borderColor: "#aaa" },
        lineStyle: { color: "gradient", curveness: 0.5 },
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default ApacheSankeyChart;
