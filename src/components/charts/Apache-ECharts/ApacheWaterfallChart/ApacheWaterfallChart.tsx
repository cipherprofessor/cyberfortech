"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheWaterfallChart.module.scss";
import { useEffect, useState } from "react";
import { ApacheWaterfallChartProps } from "../common/types";

const ApacheWaterfallChart: React.FC<ApacheWaterfallChartProps> = ({
  title = "Waterfall Chart",
  xAxisLabel = "Time",
  yAxisLabel = "Value",
  data,
}) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const colors = ["#90CAF9", "#A5D6A7", "#F48FB1", "#FFCC80"];

  const chartData =
    data || [
      { label: "Start", value: 3000 },
      { label: "Q1", value: -1200 },
      { label: "Q2", value: 800 },
      { label: "Q3", value: -600 },
      { label: "Q4", value: 900 },
      { label: "End", value: 3900 },
    ];

  const seriesData: any[] = [];
  let cumulative = 0;

  chartData.forEach((item, index) => {
    cumulative += item.value;
    seriesData.push({
      value: item.value,
      itemStyle: { color: colors[index % colors.length] },
    });
  });

  const options = {
    backgroundColor: "transparent",
    textStyle: { color: isDark ? "#EAEAEA" : "#333" },

    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },

    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#1E1E2F" : "#fff",
      borderColor: isDark ? "#333" : "#ddd",
      textStyle: { color: isDark ? "#fff" : "#333" },
    },

    legend: {
      bottom: 10,
      textStyle: { color: isDark ? "#EAEAEA" : "#333" },
    },

    xAxis: {
      type: "category",
      data: chartData.map((item) => item.label),
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
    },

    yAxis: {
      type: "value",
      name: yAxisLabel,
      nameTextStyle: { color: isDark ? "#EAEAEA" : "#333" },
      axisLabel: { color: isDark ? "#EAEAEA" : "#333" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
    },

    series: [
      {
        name: "Value",
        type: "bar",
        data: seriesData,
        barWidth: "50%",
        itemStyle: { borderRadius: [5, 5, 0, 0] },
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

export default ApacheWaterfallChart;
