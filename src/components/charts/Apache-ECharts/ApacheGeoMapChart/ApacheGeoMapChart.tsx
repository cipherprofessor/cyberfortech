import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import styles from "./ApacheGeoMapChart.module.scss";
import { ApacheGeoMapChartProps } from "../common/types";
import { mockGeoData } from "../common/mockGeoData"; // Import mock data
import * as echarts from "echarts";

// Function to generate a unique color for each country
const generateColor = (index: number) => {
  const goldenRatio = 0.61803398875; // Golden Ratio for color variation
  const hue = (index * goldenRatio * 360) % 360;
  return `hsl(${hue}, 70%, 50%)`; // Unique colors with different hues
};

const ApacheGeoMapChart: React.FC<ApacheGeoMapChartProps> = ({
  title = "World Geo Map",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch("/maps/world.json");
        if (!response.ok) throw new Error("Failed to load map data");
        const worldMap = await response.json();
        echarts.registerMap("world", worldMap);
        setIsMapLoaded(true);
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    fetchMap();
  }, []);

  if (!isMapLoaded) {
    return <div>Loading map...</div>;
  }

  const options = {
    backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
    title: {
      text: title,
      left: "center",
      textStyle: { color: isDark ? "#FFFFFF" : "#333" },
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => `${params.name}: ${params.value || 0}`,
      backgroundColor: isDark ? "#1A1A2E" : "#FFF",
      borderColor: (params: any) => params.color,
      borderWidth: 2,
      textStyle: { color: isDark ? "#FFF" : "#333" },
    },
    series: [
      {
        name: "Geo Data",
        type: "map",
        map: "world",
        roam: true,
        emphasis: {
          label: {
            show: true,
            color: "#FFF",
          },
          itemStyle: {
            areaColor: (params: any) =>
              echarts.color.modifyHSL(params.color, -10), // Slightly darker on hover
            borderColor: "#FFF",
          },
        },
        data: mockGeoData.map((item, index) => ({
          ...item,
          itemStyle: {
            areaColor: generateColor(index), // Truly unique color per country
            borderColor: "#FFF",
          },
        })),
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default ApacheGeoMapChart;
