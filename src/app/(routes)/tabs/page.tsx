"use client";
import React from "react";
import {Tabs, Tab, Card, CardBody} from "@heroui/react";
import { 
  AreaChart, 
  BarChart, 
  LineChart, 
  PieChart, 
  DonutChart,
  RadarChart,
  BrushChart,
  DrilldownChart, 
} from "@/components/charts/Re-charts";
import { ZoomableTimelineChart } from "@/components/charts/Re-charts/interactive/ZoomableTimeLineChart";
import DynamicFileUpload from "@/components/ui/example-uploader/page";

export default function ChartsDashboard() {
  const [selected, setSelected] = React.useState("area");

  // Area Chart Data
  const areaData = [
    { month: 'Jan', revenue: 4000, profit: 2400 },
    { month: 'Feb', revenue: 3000, profit: 1398 },
    { month: 'Mar', revenue: 2000, profit: 9800 },
    { month: 'Apr', revenue: 2780, profit: 3908 },
    { month: 'May', revenue: 1890, profit: 4800 },
    { month: 'Jun', revenue: 2390, profit: 3800 },
  ];

  // Bar Chart Data
  const barData = [
    { category: 'Product A', sales: 4000, returns: 400 },
    { category: 'Product B', sales: 3000, returns: 300 },
    { category: 'Product C', sales: 2000, returns: 200 },
    { category: 'Product D', sales: 2780, returns: 278 },
    { category: 'Product E', sales: 1890, returns: 189 },
  ];

  // Line Chart Data
  const lineData = [
    { date: '2024-01', users: 1000, sessions: 1200, duration: 50 },
    { date: '2024-02', users: 1500, sessions: 1700, duration: 45 },
    { date: '2024-03', users: 2000, sessions: 2400, duration: 55 },
    { date: '2024-04', users: 1750, sessions: 2100, duration: 48 },
    { date: '2024-05', users: 2500, sessions: 2900, duration: 52 },
  ];

  // Pie/Donut Chart Data
  const pieData = [
    { name: 'Mobile', value: 35, color: '#3B82F6' },
    { name: 'Desktop', value: 45, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' },
  ];

  // Radar Chart Data
  const radarData = [
    { subject: 'Speed', current: 65, target: 90 },
    { subject: 'Reliability', current: 80, target: 85 },
    { subject: 'Usage', current: 90, target: 75 },
    { subject: 'Security', current: 70, target: 95 },
    { subject: 'Performance', current: 85, target: 80 },
  ];

  // Timeline Chart Data
  const timelineData = [
    { date: '2024-01', revenue: 4000, users: 2400, growth: 20 },
    { date: '2024-02', revenue: 3000, users: 1398, growth: 15 },
    { date: '2024-03', revenue: 2000, users: 9800, growth: 25 },
    { date: '2024-04', revenue: 2780, users: 3908, growth: 18 },
    { date: '2024-05', revenue: 1890, users: 4800, growth: 22 },
    { date: '2024-06', revenue: 2390, users: 3800, growth: 20 },
  ];

  // Brush Chart Data
const brushData = [
    { date: '2024-01-01', sales: 4000, visitors: 2400, conversion: 1.5 },
    { date: '2024-01-02', sales: 3000, visitors: 1398, conversion: 2.1 },
    { date: '2024-01-03', sales: 2000, visitors: 9800, conversion: 0.8 },
    { date: '2024-01-04', sales: 2780, visitors: 3908, conversion: 1.9 },
    { date: '2024-01-05', sales: 1890, visitors: 4800, conversion: 1.2 },
    { date: '2024-01-06', sales: 2390, visitors: 3800, conversion: 1.7 },
    { date: '2024-01-07', sales: 3490, visitors: 4300, conversion: 2.3 },
  ];
  
  // Drilldown Chart Data
  const drilldownLevels = [
    {
      id: 'categories',
      data: [
        { name: 'Electronics', value: 12400 },
        { name: 'Clothing', value: 9800 },
        { name: 'Books', value: 6000 },
        { name: 'Electronics', value: 12400 },
        { name: 'Clothing', value: 9800 },
        { name: 'Books', value: 6000 },
        { name: 'Electronics', value: 12400 },
        { name: 'Clothing', value: 9800 },
        { name: 'Books', value: 6000 },
        { name: 'Electronics', value: 12400 },
        { name: 'Clothing', value: 9800 },
        { name: 'Books', value: 6000 },
        { name: 'Electronics', value: 12400 },
        { name: 'Clothing', value: 9800 },
        { name: 'Books', value: 6000 },
        { name: 'Electronics', value: 12400 },
        { name: 'Clothing', value: 9800 },
        { name: 'Books', value: 6000 },
      ]
    }
  ];


  return (
    <div className="flex w-full flex-col">
      <Tabs 
        aria-label="Chart Options" 
        selectedKey={selected} 
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="area" title="Area Chart">
          <Card>
            <CardBody>
              <AreaChart 
                data={areaData}
                areas={[
                  { key: 'revenue', name: 'Revenue', gradient: 'primary' },
                  { key: 'profit', name: 'Profit', gradient: 'success' }
                ]}
                xAxis="month"
                height={400}
                currency={true}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="bar" title="Bar Chart">
          <Card>
            <CardBody>
              <BarChart 
                data={barData}
                bars={[
                  { key: 'sales', name: 'Sales', gradient: 'primary' },
                  { key: 'returns', name: 'Returns', gradient: 'error' }
                ]}
                xAxis="category"
                height={400}
                currency={true}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="line" title="Line Chart">
          <Card>
            <CardBody>
              <LineChart 
                data={lineData}
                lines={[
                  { key: 'users', name: 'Users', gradient: 'primary' },
                  { key: 'sessions', name: 'Sessions', gradient: 'success' },
                  { key: 'duration', name: 'Avg Duration', gradient: 'warning' }
                ]}
                xAxis="date"
                height={400}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="pie" title="Pie Chart">
          <Card>
            <CardBody>
              <PieChart 
                data={pieData}
                height={400}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="donut" title="Donut Chart">
          <Card>
            <CardBody>
              <DonutChart 
                data={pieData}
                height={400}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="radar" title="Radar Chart">
          <Card>
            <CardBody>
              <RadarChart 
                data={radarData}
                series={[
                  { dataKey: 'current', name: 'Current', color: '#3B82F6' },
                  { dataKey: 'target', name: 'Target', color: '#10B981' }
                ]}
                height={400}
              />
            </CardBody>
          </Card>
        </Tab>


<Tab key="timeline" title="Timeline Chart">
  <Card>
    <CardBody>
      <ZoomableTimelineChart 
        data={timelineData}
        series={[
          // Growth percentage on right axis
          { 
            type: 'line', 
            key: 'growth', 
            name: 'Growth %', 
            color: '#10B981',
            yAxisId: 'right'  // Percentage axis
          },
          // Revenue on left axis (default)
          { 
            type: 'bar', 
            key: 'revenue', 
            name: 'Revenue', 
            gradient: 'primary',
            yAxisId: 'left'  // Money axis
          },
          // Users on left axis
          { 
            type: 'area', 
            key: 'users', 
            name: 'Users', 
            gradient: 'success',
            yAxisId: 'left'  // Count axis
          }
        ]}
        xAxis="date"
        height={400}
        currency={true}
      />
    </CardBody>
  </Card>
</Tab>


<Tab key="brush" title="Brush Chart">
  <Card>
    <CardBody>
      <BrushChart 
        data={brushData}
        series={[
          { 
            type: 'line', 
            key: 'sales', 
            name: 'Sales', 
            color: '#3B82F6',
            yAxisId: 'left' 
          },
          { 
            type: 'bar', 
            key: 'visitors', 
            name: 'Visitors', 
            color: '#10B981',
            yAxisId: 'left'
          },
          { 
            type: 'line', 
            key: 'conversion', 
            name: 'Conversion Rate', 
            color: '#F59E0B',
            yAxisId: 'right'
          }
        ]}
        xAxisKey="date"
        height={400}
        brushHeight={60}
        startIndex={0}
        endIndex={6}
      />
    </CardBody>
  </Card>
</Tab>

<Tab key="drilldown" title="Drilldown Chart">
  <Card>
    <CardBody>
      <DrilldownChart
        levels={drilldownLevels}
        initialLevelId="categories"
        height={400}
        colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
      />
    </CardBody>
  </Card>
</Tab>

<Tab key="drilldown1" title="Drilldown Chart">
  <Card>
    <CardBody>
    <DynamicFileUpload />
    </CardBody>
  </Card>
</Tab>



      </Tabs>
    </div>
  );
}