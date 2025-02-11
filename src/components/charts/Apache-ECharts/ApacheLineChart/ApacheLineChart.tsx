"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheLineChart.module.scss";
import { lineChartData } from "../common/mockData";
import { useEffect, useState } from "react";

const ApacheLineChart = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colors = isDark ? ["#57A6FF", "#A133FF"] : ["#FF5733", "#33FF57"];

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },

    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#333" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    xAxis: {
      type: "category",
      data: lineChartData.map((item) => item.label),
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
    },

    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: isDark ? "#AAA" : "#333" } },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    series: [
      {
        name: "Performance",
        type: "line",
        data: lineChartData.map((item) => item.value),
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: colors[0],
          borderColor: "#fff",
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors[0] },
              { offset: 1, color: "transparent" },
            ],
          },
        },
        lineStyle: { width: 3, shadowBlur: 10, shadowColor: colors[0] },
        emphasis: { scale: 1.2 },
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

export default ApacheLineChart;
