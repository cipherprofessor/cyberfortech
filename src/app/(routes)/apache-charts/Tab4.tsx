"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ApacheRibbonChart from "@/components/charts/Apache-ECharts/ApacheRibbonChart/ApacheRibbonChart";
import { densityPlotData, histogramChartData, pyramidChartData, ribbonChartMockData } from "@/components/charts/Apache-ECharts/common/mockData";
import ApacheDensityPlotChart from "@/components/charts/Apache-ECharts/ApacheDensityPlotChart/ApacheDensityPlotChart";
import ApachePyramidChart from "@/components/charts/Apache-ECharts/ApachePyramidChart/ApachePyramidChart";
import ApacheHistogramChart from "@/components/charts/Apache-ECharts/ApacheHistogramChart/ApacheHistogramChart";



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


        <Tab key="DensityPlotChart" title="DensityPlotChart">
          <Card>
            <CardBody>
            <ApacheDensityPlotChart 
        title="Custom Density Plot"
        data={densityPlotData}
        xAxisLabel="Categories"
        yAxisLabel="Density Values"
      />
            </CardBody>
          </Card>
        </Tab>


        <Tab key="ApachePyramidChart" title="ApachePyramidChart">
          <Card>
            <CardBody>
            <ApachePyramidChart title="Sales Pyramid" data={pyramidChartData} />
            </CardBody>
          </Card>
        </Tab>

        

        <Tab key="ApacheHistogramChart" title="Histogram Chart">
          <Card>
            <CardBody>
            <ApacheHistogramChart
        title="Data Distribution"
        data={histogramChartData}
        xAxisLabel="Data Bins"
        yAxisLabel="Number of Occurrences"
        barWidth={40}
      />
            </CardBody>
          </Card>
        </Tab>

        {/* <Tab key="" title="">
          <Card>
            <CardBody>
            
            </CardBody>
          </Card>
        </Tab> */}


        {/* <Tab key="" title="">
          <Card>
            <CardBody>
            
            </CardBody>
          </Card>
        </Tab> */}



        {/* <Tab key="" title="">
          <Card>
            <CardBody>
            
            </CardBody>
          </Card>
        </Tab> */}




        



      </Tabs>
    </div>
  );
}
