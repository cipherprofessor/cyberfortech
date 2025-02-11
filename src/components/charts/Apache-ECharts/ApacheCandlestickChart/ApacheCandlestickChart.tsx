import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheCandlestickChart.module.scss";
import { ApacheCandlestickChartProps } from "../common/types";

const ApacheCandlestickChart: React.FC<ApacheCandlestickChartProps> = ({
  title = "Candlestick Chart",
  xAxisLabel = "Date",
  yAxisLabel = "Price",
  data = [],
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
      trigger: "axis",
      backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
      borderWidth: 2,
      textStyle: { color: isDark ? "#FFF" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },

    legend: {
      bottom: 10,
      data: ["Candlestick"],
      textStyle: { color: isDark ? "#FFF" : "#333" },
    },

    xAxis: {
      type: "category",
      data: data.map((item) => item[0]),
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#000000" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#000000" },
      name: xAxisLabel,
      nameLocation: "middle",
      nameGap: 35,
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#000000", fontSize: 14, fontWeight: "bold" },
    },

    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: isDark ? "#FFFFFF" : "#000000" } },
      axisLabel: { color: isDark ? "#FFFFFF" : "#000000" },
      splitLine: { lineStyle: { color: isDark ? "#444" : "#DDD" } },
      name: yAxisLabel,
      nameLocation: "middle",
      nameGap: 50,
      nameRotate: 90,
      nameTextStyle: { color: isDark ? "#FFFFFF" : "#000000", fontSize: 14, fontWeight: "bold" },
    },

    series: [
      {
        // name: "Candlestick",
        type: "candlestick",
        data: data.map((item) => [item[1], item[2], item[3], item[4]]), // [Open, High, Low, Close]
        itemStyle: {
          color: "#22C55E", // Green for rising candles
          color0: "#EF4444", // Red for falling candles
          borderColor: "#16A34A", // Dark green border
          borderColor0: "#B91C1C", // Dark red border
        },
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default ApacheCandlestickChart;
