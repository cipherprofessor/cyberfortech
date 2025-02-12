"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ApacheGeoMapChart from "@/components/charts/Apache-ECharts/ApacheGeoMapChart/ApacheGeoMapChart";
import { bar3DChartData, geoMapData, groupedBarChartData, stackedAreaChartData, stackedBarChartData, stepLineChartData, streamGraphMockData, surface3DChartData, temperatureStepLineData } from "@/components/charts/Apache-ECharts/common/mockData";
import Apache3DBarChart from "@/components/charts/Apache-ECharts/Apache3DBarChart/Apache3DBarChart";
import Apache3DSurfaceChart from "@/components/charts/Apache-ECharts/Apache3DSurfaceChart/Apache3DSurfaceChart";
import ApacheStepLineChart from "@/components/charts/Apache-ECharts/ApacheStepLineChart/ApacheStepLineChart";
import ApacheStackedAreaChart from "@/components/charts/Apache-ECharts/ApacheStackedAreaChart/ApacheStackedAreaChart";
import ApacheStackedBarChart from "@/components/charts/Apache-ECharts/ApacheStackedBarChart/ApacheStackedBarChart";
import ApacheGroupedBarChart from "@/components/charts/Apache-ECharts/ApacheGroupedBarChart/ApacheGroupedBarChart";
import ApacheStreamGraphChart from "@/components/charts/Apache-ECharts/ApacheStreamGraphChart/ApacheStreamGraphChart";


export default function ChartsDashboardTab3() {
  const [selected, setSelected] = React.useState("geo");

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Chart Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="ApacheGeoMapChart" title="Apache Geo Map Chart">
          <Card>
            <CardBody>
              <ApacheGeoMapChart title="World Geo Map" data={geoMapData} />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="Apache3DBarChart" title="3D Bar Chart">
          <Card>
            <CardBody>
              <Apache3DBarChart title="3D Bar Chart Example" data={bar3DChartData} />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="Apache3DSurfaceChart" title="3D Surface Chart">
          <Card>
            <CardBody>
              <Apache3DSurfaceChart title="3D Surface Chart Example" data={surface3DChartData} />
            </CardBody>
          </Card>
        </Tab>


        <Tab key="ApacheStepLineChart" title="Step Line Chart">
          <Card>
            <CardBody>
              <ApacheStepLineChart
                title="Monthly Sales Trend"
                data={stepLineChartData}
                xAxisLabel="Month"
                yAxisLabel="Sales"
                metricUnit=" units"
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="ApacheTemperatureChart" title="Temperature Trend">
          <Card>
            <CardBody>
              <ApacheStepLineChart
                title="Daily Temperature Fluctuations"
                data={temperatureStepLineData}
                xAxisLabel="Day"
                yAxisLabel="Temperature"
                metricUnit="°C"
              />
            </CardBody>
          </Card>
        </Tab>



        <Tab key="stackedArea" title="Stacked Area Chart">
          <Card>
            <CardBody>
              <ApacheStackedAreaChart
                title=""
                data={stackedAreaChartData}
                xAxisLabel="Months"
                yAxisLabel="Financial Metrics ($)"
              />
            </CardBody>
          </Card>
        </Tab>


        <Tab key="StackedBarChart" title="Stacked Bar Chart">
  <Card>
    <CardBody>
      <ApacheStackedBarChart 
        title="Quarterly Revenue Breakdown" 
        data={stackedBarChartData} 
        xAxisLabel="Quarter" 
        yAxisLabel="Amount ($)"
      />
    </CardBody>
  </Card>
</Tab>


<Tab key="ApacheGroupedBarChart" title="Grouped Bar Chart">
  <Card>
    <CardBody>
      <ApacheGroupedBarChart
        title="Product Sales Comparison"
        data={groupedBarChartData}
        xAxisLabel="Months"
        yAxisLabel="Sales Count"
      />
    </CardBody>
  </Card>
</Tab>


<Tab key="ApacheStreamGraphChartt" title="Stream Graph Chart">
  <Card>
    <CardBody>

    <ApacheStreamGraphChart
      data={streamGraphMockData}
      xAxisLabel="Months"
      yAxisLabel="Sales"
      lightColors={["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]}
      darkColors={["#ffb74d", "#81c784", "#64b5f6", "#e57373"]}
    />

    </CardBody>

  </Card>
</Tab>



      </Tabs>
    </div>
  );
}
