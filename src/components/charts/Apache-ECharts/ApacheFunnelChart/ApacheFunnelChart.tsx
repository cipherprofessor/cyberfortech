"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheFunnelChart.module.scss";
import { funnelChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheFunnelChart = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colorsLight = ["#42A5F5", "#66BB6A", "#FFA726", "#EC407A", "#AB47BC"];
  const colorsDark = ["#1E88E5", "#43A047", "#FB8C00", "#D81B60", "#8E24AA"];

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#E0E0E0" : "#333" },

    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderWidth: 2,
      borderColor: isDark ? "#555" : "#ccc",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    legend: {
      bottom: 10,
      textStyle: { color: isDark ? "#E0E0E0" : "#333" },
      formatter: (name: string) => {
        const item = funnelChartData.find((d) => d.name === name);
        return item ? `${name}: ${item.value}` : name;
      },
      selectedMode: "multiple",
    },

    series: [
      {
        name: "Funnel Data",
        type: "funnel",
        left: "10%",
        right: "10%",
        top: "10%",
        bottom: "10%",
        width: "80%",
        minSize: "20%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
          color: "#fff",
          fontWeight: "bold",
          formatter: (params: any) => `${params.name}: ${params.value}%`,
        },
        emphasis: {
          focus: "self",
          itemStyle: {
            opacity: 0.8,
          },
        },
        data: funnelChartData.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: isDark ? colorsDark[index] : colorsLight[index] },
                { offset: 1, color: isDark ? colorsDark[index] + "88" : colorsLight[index] + "88" },
              ],
            },
            borderColor: isDark ? colorsDark[index] : colorsLight[index],
            borderWidth: 2,
          },
        })),
        animationDuration: 1000,
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApacheFunnelChart;
