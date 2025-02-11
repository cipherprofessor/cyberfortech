"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ApacheLineChart from "@/components/charts/Apache-ECharts/ApacheLineChart/ApacheLineChart";
import ApacheBarChart from "@/components/charts/Apache-ECharts/ApacheBarChart/ApacheBarChart";
import ApachePieChart from "@/components/charts/Apache-ECharts/ApachePieChart/ApachePieChart";
import ApacheAreaChart from "@/components/charts/Apache-ECharts/ApacheAreaChart/ApacheAreaChart";
import ApacheRadarChart from "@/components/charts/Apache-ECharts/ApacheRadarChart/ApacheRadarChart";
import ApacheFunnelChart from "@/components/charts/Apache-ECharts/ApacheFunnelChart/ApacheFunnelChart";
import ApacheScatterChart from "@/components/charts/Apache-ECharts/ApacheScatterChart/ApacheScatterChart";
import { barChartData, boxplotData, gaugeChartData, mockTreemapData, scatterChartData } from "@/components/charts/Apache-ECharts/common/mockData";
import ApacheHeatmapChart from "@/components/charts/Apache-ECharts/ApacheHeatmapChart/ApacheHeatmapChart";
import ApacheGaugeChart from "@/components/charts/Apache-ECharts/ApacheGaugeChart/ApacheGaugeChart";
import ApacheTreemapChart from "@/components/charts/Apache-ECharts/ApacheTreemapChart/ApacheTreemapChart";
import ApacheBoxplotChart from "@/components/charts/Apache-ECharts/ApacheBoxplotChart/ApacheBoxplotChart";



export default function ChartsDashboardTab1() {
  const [selected, setSelected] = React.useState("line");

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Chart Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="line" title="Line Chart">
          <Card>
            <CardBody>
              <ApacheLineChart />
            </CardBody>
          </Card>
        </Tab>
      


        <Tab key="bar" title="Bar Chart">
          <Card>
            <CardBody>
              <ApacheBarChart
                title="Revenue Overview"
                data={barChartData}
              />
            </CardBody>
          </Card>
        </Tab>



        <Tab key="pie" title="Pie Chart">
          <Card>
            <CardBody>
              <ApachePieChart />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="ApacheAreaChart" title="ApacheAreaChart">
          <Card>
            <CardBody>
              <ApacheAreaChart />
            </CardBody>
          </Card>
        </Tab>


  

        <Tab key="ApacheRadarChart" title="ApacheRadarChart">
          <Card>
            <CardBody>
              <ApacheRadarChart />
            </CardBody>
          </Card>
        </Tab>

    


        <Tab key="ApacheFunnelChart " title="ApacheFunnelChart">
          <Card>
            <CardBody>
              <ApacheFunnelChart />
            </CardBody>
          </Card>
        </Tab>


        <Tab key="scatter" title="Scatter Chart">
  <Card>
    <CardBody>
    <ApacheScatterChart
        title="Speed vs Distance"
        xAxisLabel="Speed (km/h)"
        yAxisLabel="Distance (km)"
        data={scatterChartData}
      />
    </CardBody>
  </Card>
</Tab>


<Tab key="heatmap" title="Heatmap">
  <Card>
    <CardBody>
      <ApacheHeatmapChart title="User Activity Heatmap" />
    </CardBody>
  </Card>
</Tab>


<Tab key="gauge_chart" title="Gauge Chart">
  <Card>
    <CardBody>
      <ApacheGaugeChart title="System Performance" data={gaugeChartData} />
    </CardBody>
  </Card>
</Tab>;


<Tab key="treemap" title="Treemap">
  <Card>
    <CardBody>
      <ApacheTreemapChart title="Product Sales Distribution" data={mockTreemapData} />
    </CardBody>
  </Card>
</Tab>

    <Tab key="boxplot" title="Boxplot Chart">
          <ApacheBoxplotChart 
            title="Revenue Analysis" 
            xAxisLabel="Months" 
            yAxisLabel="Revenue (USD)" 
            data={boxplotData}
          />
        </Tab>




        </Tabs>
    </div>
  );
}
