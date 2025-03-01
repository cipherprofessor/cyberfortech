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




export default function ChartsDashboardTab2() {
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
  
        
        <Tab key="ApacheCandlestickChart" title="Apache Candlestick Chart">
  <Card>
    <CardBody>
      <ApacheCandlestickChart
        title="Stock Market Data"
        xAxisLabel="Date"
        yAxisLabel="Price"
        data={candlestickData} // Ensure your data is structured correctly
      />
    </CardBody>
  </Card>
</Tab>

<Tab key="ApacheSankeyChart" title="Apache Sankey Chart">
  <Card>
    <CardBody>
      <ApacheSankeyChart
        title="Flow of Data"
        data={sankeyChartData}
      />
    </CardBody>
  </Card>
</Tab>


<Tab key="ApacheChordChart" title="Apache Chord Chart">
  <Card>
    <CardBody>
      <ApacheChordChart
        title="Chord Graph Visualization"
        data={chordChartData.nodes}
        links={chordChartData.links}
      />
    </CardBody>
  </Card>
</Tab>


<Tab key="ApacheSunburstChart" title="Apache Sunburst Chart">
  <Card>
    <CardBody>
      <ApacheSunburstChart title="Sunburst Visualization" data={sunburstChartData} />
    </CardBody>
  </Card>
</Tab>


<Tab key="ApacheForceGraph" title="Apache Force Graph">
  <Card>
    <CardBody>
      <ApacheForceGraph title="Network Connections" data={forceGraphData} />
    </CardBody>
  </Card>
</Tab>


<Tab key="ApacheParallelChart" title="Apache Parallel Chart">
  <Card>
    <CardBody>
      <ApacheParallelChart title="Performance Analysis" data={parallelChartData.data} dimensions={parallelChartData.dimensions} />
    </CardBody>
  </Card>
</Tab>

<Tab key="ApachePolarChart" title="Apache Polar Chart">
  <Card>
    <CardBody>
      <ApachePolarChart title="Polar Chart Example" data={polarChartData} />
    </CardBody>
  </Card>
</Tab>







        </Tabs>
    </div>
  );
}
