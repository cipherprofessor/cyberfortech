"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ApacheRibbonChart from "@/components/charts/Apache-ECharts/ApacheRibbonChart/ApacheRibbonChart";
import { apacheDotPlotMockData, ApacheMarimekkoMockData, bulletChartData, densityPlotData, histogramChartData, mockApacheViolinChartData, mockDumbbellData, mockLollipopChartData, pyramidChartData, ribbonChartMockData } from "@/components/charts/Apache-ECharts/common/mockData";
import ApacheDensityPlotChart from "@/components/charts/Apache-ECharts/ApacheDensityPlotChart/ApacheDensityPlotChart";
import ApachePyramidChart from "@/components/charts/Apache-ECharts/ApachePyramidChart/ApachePyramidChart";
import ApacheHistogramChart from "@/components/charts/Apache-ECharts/ApacheHistogramChart/ApacheHistogramChart";
import ApacheBulletChart from "@/components/charts/Apache-ECharts/ApacheBulletChart/ApacheBulletChart";
import ApacheLollipopChart from "@/components/charts/Apache-ECharts/ApacheLollipopChart/ApacheLollipopChart";
import ApacheMarimekkoChart from "@/components/charts/Apache-ECharts/ApacheMarimekkoChart/ApacheMarimekkoChart";
import ApacheViolinChart from "@/components/charts/Apache-ECharts/ApacheViolinChart/ApacheViolinChart";
import ApacheDumbbellChart from "@/components/charts/Apache-ECharts/ApacheDumbbellChart/ApacheDumbbellChart";
import ApacheDotPlotChart from "@/components/charts/Apache-ECharts/ApacheDotPlotChart/ApacheDotPlotChart";



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

        <Tab key="ApacheBulletChart" title="Bullet Chart">
          <Card>
            <CardBody>
            <ApacheBulletChart
        title="Performance Metrics"
        data={bulletChartData}
        xAxisLabel="Percentage"
        yAxisLabel="Metrics"
      />
            </CardBody>
          </Card>
        </Tab>


        <Tab key="ApacheLollipopChart" title="Lollipop Chart">
          <Card>
            <CardBody>
            <ApacheLollipopChart
        title="Sales Data Lollipop Chart"
        data={mockLollipopChartData}
        xAxisLabel="Products"
        yAxisLabel="Sales"
      />
            </CardBody>
          </Card>
        </Tab>



        <Tab key="ApacheMarimekkoChart" title="Marimekko Chart">
          <Card>
            <CardBody>

             <ApacheMarimekkoChart
        title="Sales Distribution"
        data={ApacheMarimekkoMockData}
        xAxisLabel="Product Categories"
        yAxisLabel="Market Share (%)"
      />
            
            </CardBody>
          </Card>
        </Tab>


         <Tab key="ViolinChart" title="Violin Chart">
          <Card>
            <CardBody>
            <ApacheViolinChart
        title="Distribution Analysis"
        data={mockApacheViolinChartData}
        xAxisLabel="Categories"
        yAxisLabel="Values"
      />
            </CardBody>
          </Card>
        </Tab>


         <Tab key="DumbbellChart" title="Dumbbell Chart">
          <Card>
            <CardBody>
            <ApacheDumbbellChart
      title="Custom Dumbbell Chart"
      data={mockDumbbellData}
      xAxisLabel="Categories"
      yAxisLabel="Values"
    />
            </CardBody>
          </Card>
        </Tab>


         <Tab key="DotPlotChart" title=" Apache Dot Plot Chart">
          <Card>
            <CardBody>
             <ApacheDotPlotChart 
        title="Dot Plot Visualization" 
        data={apacheDotPlotMockData}
        xAxisLabel="Category"
        yAxisLabel="Value"
      />
            </CardBody>
          </Card>
        </Tab>




        



      </Tabs>
    </div>
  );
}
