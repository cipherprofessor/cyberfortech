import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheForceGraph.module.scss";
import { ApacheForceGraphProps } from "../common/types";

const ApacheForceGraph: React.FC<ApacheForceGraphProps> = ({
  title = "Force-Directed Graph",
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
      borderColor: "#888",
      borderWidth: 2,
      textStyle: { color: isDark ? "#FFF" : "#333" },
      formatter: (params: any) => `
        <div style="border-left: 5px solid ${params.color}; padding-left: 8px;">
          <b style="color:${params.color}">${params.name}</b><br/>
          Value: ${params.value}
        </div>
      `,
    },

    series: [
      {
        type: "graph",
        layout: "force",
        roam: true,
        force: {
          repulsion: 100,
          edgeLength: 50,
        },
        label: {
          show: true,
          position: "right",
          color: isDark ? "#FFF" : "#000",
        },
        data: data.nodes.map((node) => ({
          ...node,
          symbolSize: node.value,
          itemStyle: { color: node.color },
        })),
        edges: data.links.map((link) => ({
          ...link,
          lineStyle: { color: "#888" },
        })),
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "450px", width: "100%" }} />
    </div>
  );
};

export default ApacheForceGraph;
