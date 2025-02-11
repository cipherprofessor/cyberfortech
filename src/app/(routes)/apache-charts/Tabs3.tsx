"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { barChartData, boxplotData, bubbleChartData, candlestickData, chordChartData, forceGraphData, gaugeChartData, mockTreemapData, parallelChartData, polarChartData, sankeyChartData, scatterChartData, sunburstChartData, waterfallChartData } from "@/components/charts/Apache-ECharts/common/mockData";
import ApacheBubbleChart from "@/components/charts/Apache-ECharts/ApacheBubbleChart/ApacheBubbleChart";
import ApacheCandlestickChart from "@/components/charts/Apache-ECharts/ApacheCandlestickChart/ApacheCandlestickChart";
import ApacheSankeyChart from "@/components/charts/Apache-ECharts/ApacheSankeyChart/ApacheSankeyChart";
import ApacheChordChart from "@/components/charts/Apache-ECharts/ApacheChordChart/ApacheChordChart";
import ApacheSunburstChart from "@/components/charts/Apache-ECharts/ApacheSunburstChart/ApacheSunburstChart";
import ApacheForceGraph from "@/components/charts/Apache-ECharts/ApacheForceGraph/ApacheForceGraph";
import ApacheParallelChart from "@/components/charts/Apache-ECharts/ApacheParallelChart/ApacheParallelChart";
import ApachePolarChart from "@/components/charts/Apache-ECharts/ApachePolarChart/ApachePolarChart";




export default function ChartsDashboardTab3() {
  const [selected, setSelected] = React.useState("line");

  return (

    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Chart Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="ApacheBubbleChart" title="Apache Bubble Chart">
          <Card>
            <CardBody>
              <ApacheBubbleChart
              title="Bubble Chart Example" 
              xAxisLabel="X Axis" 
              yAxisLabel="Y Axis" 
              data={bubbleChartData}
            /> 
            </CardBody>
          </Card>
        </Tab>

        </Tabs>
    </div>
  );
}
