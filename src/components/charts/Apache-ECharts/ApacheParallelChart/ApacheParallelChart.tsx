import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheParallelChart.module.scss";
import { ApacheParallelChartProps } from "../common/types";

const ApacheParallelChart: React.FC<ApacheParallelChartProps> = ({
  title = "Parallel Coordinates Chart",
  data,
  dimensions,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Generate unique colors for each line
  const generateColors = (count: number, darkMode: boolean) => {
    const lightColors = [
      "#FF5733", "#33FF57", "#3399FF", "#FF33A1", "#FFD700", "#FF4500",
      "#8A2BE2", "#00CED1", "#DC143C", "#FF8C00", "#4B0082", "#7FFF00"
    ];

    const darkColors = [
      "#FF9999", "#99FF99", "#99CCFF", "#FF99CC", "#FFDD77", "#FF7744",
      "#AA88EE", "#33D1D1", "#EE6677", "#FFA566", "#8877DD", "#99FF77"
    ];

    return Array.from({ length: count }, (_, i) => (darkMode ? darkColors[i % darkColors.length] : lightColors[i % lightColors.length]));
  };

  const lineColors = generateColors(data.length, isDark);

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
      formatter: (params: any) => {
        const dataIndex = params.dataIndex;
        const color = lineColors[dataIndex]; // Match tooltip color to line color
        return `
          <div style="border-left: 5px solid ${color}; padding-left: 8px;">
            <b style="color:${color}">${title} - Sample ${dataIndex + 1}</b><br/>
            ${dimensions.map((dim, i) => `${dim}: ${params.data[i]}`).join("<br/>")}
          </div>
        `;
      },
    },

    parallelAxis: dimensions.map((dim, index) => ({
      dim: index,
      name: dim,
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#000000", fontSize: 14, fontWeight: "bold" },
      axisLabel: { color: isDark ? "#FFFFFF" : "#000000" },
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#000000" } },
    })),

    series: [
      {
        type: "parallel",
        lineStyle: {
          width: 2,
          opacity: 0.8,
        },
        data: data.map((item, index) => ({
          value: item,
          lineStyle: { color: lineColors[index] }, // Apply unique color to each line
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

export default ApacheParallelChart;
