"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApachePieChart.module.scss";
import { pieChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApachePieChart = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colorsLight = ["#A5D6A7", "#90CAF9", "#CE93D8", "#FFCC80", "#B0BEC5", "#F48FB1"];
  const colorsDark = ["#66BB6A", "#42A5F5", "#AB47BC", "#FFA726", "#78909C", "#EC407A"];

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
      formatter: (params: any) => {
        return `<b style="color:${params.color}">${params.name}</b>: ${params.value} (${params.percent}%)`;
      },
    },

    legend: {
      orient: "horizontal",
      bottom: 10,
      textStyle: { color: isDark ? "#E0E0E0" : "#333" },
      formatter: (name: string) => {
        const item = pieChartData.find((d) => d.label === name);
        return item ? `${name}: ${item.value}` : name;
      },
      selectedMode: false, // Clicking on legend does not hide other categories
    },

    series: [
      {
        name: "Category Data",
        type: "pie",
        radius: ["42%", "58%"], // Keeps it sleek
        center: ["50%", "50%"],
        itemStyle: {
          borderRadius: 5,
          borderWidth: 2,
          borderColor: isDark ? "#222" : "#fff",
        },
        label: {
          color: isDark ? "#E0E0E0" : "#333",
        },
        emphasis: {
          scale: 1.08,
        },
        data: pieChartData.map((item, index) => ({
          value: item.value,
          name: item.label,
          itemStyle: {
            color: isDark ? colorsDark[index % colorsDark.length] : colorsLight[index % colorsLight.length],
            borderColor: isDark ? colorsDark[index % colorsDark.length] : colorsLight[index % colorsLight.length],
            shadowBlur: 8,
            shadowColor: "rgba(0,0,0,0.1)",
          },
        })),
        animationDuration: 800,
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApachePieChart;
