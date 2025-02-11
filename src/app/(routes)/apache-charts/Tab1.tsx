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
              <ApacheBarChart />
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


        ApacheRadarChart

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
      <ApacheScatterChart />
    </CardBody>
  </Card>
</Tab>



        </Tabs>
    </div>
  );
}
