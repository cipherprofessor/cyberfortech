"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheTreemapChart.module.scss";
import { useEffect, useState } from "react";

interface ApacheTreemapChartProps {
  title?: string;
  data?: { name: string; value: number }[];
}

const ApacheTreemapChart: React.FC<ApacheTreemapChartProps> = ({
  title = "Treemap Chart",
  data,
}) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const chartData =
    data || [
      { name: "Category A", value: 40 },
      { name: "Category B", value: 30 },
      { name: "Category C", value: 20 },
      { name: "Category D", value: 15 },
      { name: "Category E", value: 10 },
    ];

  const options = {
    backgroundColor: "transparent",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#333" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },
    series: [
      {
        name: "Treemap",
        type: "treemap",
        data: chartData,
        label: {
          show: true,
          color: isDark ? "#EAEAEA" : "#333",
          formatter: "{b}\n{c}",
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 2,
          gapWidth: 2,
        },
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApacheTreemapChart;
