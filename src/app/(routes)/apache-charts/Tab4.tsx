"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ApacheRibbonChart from "@/components/charts/Apache-ECharts/ApacheRibbonChart/ApacheRibbonChart";
import { ribbonChartMockData } from "@/components/charts/Apache-ECharts/common/mockData";



export default function ChartsDashboardTab4() {
  const [selected, setSelected] = React.useState("geo");

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Chart Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="ApacheRibbonChart" title="RibbonChart">
          <Card>
            <CardBody>
            <ApacheRibbonChart
      data={ribbonChartMockData}
    //   lightModeColors={["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]}
    //   darkModeColors={["#ffb74d", "#81c784", "#64b5f6", "#e57373"]}
    />
            </CardBody>
          </Card>
        </Tab>


        {/* <Tab key="" title="">
          <Card>
            <CardBody>
            
            </CardBody>
          </Card>
        </Tab>


        <Tab key="" title="">
          <Card>
            <CardBody>
            
            </CardBody>
          </Card>
        </Tab>


        <Tab key="" title="">
          <Card>
            <CardBody>
            
            </CardBody>
          </Card>
        </Tab> */}




        



      </Tabs>
    </div>
  );
}
