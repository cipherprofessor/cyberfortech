import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheSunburstChart.module.scss";
import { ApacheSunburstChartProps } from "../common/types";

const ApacheSunburstChart: React.FC<ApacheSunburstChartProps> = ({
  title = "Sunburst Chart",
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
      trigger: "item",
      backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
      borderWidth: 2,
      textStyle: { color: isDark ? "#FFF" : "#333" },
      extraCssText: "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);",
    },
  
    series: [
      {
        type: "sunburst",
        radius: [0, "90%"],
        label: {
          show: true,
          color: isDark ? "#FFF" : "#000",
          rotate: "tangential", // ✅ Curves text around each segment
          minAngle: 10,
          fontSize: 12,
          fontWeight: "bold",
          rich: {
            a: {
              fontSize: 12,
              align: "center",
              verticalAlign: "middle",
              lineHeight: 14,
            },
          },
        },
        data,
        emphasis: {
          focus: "ancestor",
        },
        levels: [{}, { r0: "15%", r: "35%" }, { r0: "35%", r: "70%" }, { r0: "70%", r: "100%" }],
        animation: true,
      },
    ],
  };
  
  

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheSunburstChart;
