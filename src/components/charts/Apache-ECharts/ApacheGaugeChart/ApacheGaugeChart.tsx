"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./ApacheGaugeChart.module.scss";
import { ApacheGaugeChartProps } from "../common/types";

const ApacheGaugeChart: React.FC<ApacheGaugeChartProps> = ({ title, data }) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },

    tooltip: {
      trigger: "item",
      formatter: `{b}: {c}%`,
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#333" : "#ddd",
      borderWidth: 1,
      textStyle: { color: isDark ? "#fff" : "#333" },
    },

    series: [
      {
        type: "gauge",
        detail: { formatter: "{value}%", fontSize: 16, color: isDark ? "#EAEAEA" : "#333" },
        data: data,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.3, "#67e0e3"],
              [0.7, "#37a2da"],
              [1, "#fd666d"],
            ],
          },
        },
        pointer: { width: 5 },
        title: { show: true, offsetCenter: [0, "90%"], color: isDark ? "#EAEAEA" : "#333" },
        animationDuration: 1000,
      },
    ],
  };

  return (
    <div className={`${styles.chartContainer} ${isDark ? styles.dark : ""}`}>
      <h3 className={styles.title}>{title}</h3>
      <ReactECharts option={options} style={{ width: "100%", height: "350px" }} />
    </div>
  );
};

export default ApacheGaugeChart;
