# Apache ECharts Components for Next.js

This repository contains a collection of **fully reusable** and **customizable** data visualization components using **Apache ECharts** in a **Next.js 14 (App Router) project**. Each chart supports:

✅ **Dark & Light Mode**  
✅ **Fully Responsive Design**  
✅ **Dynamic Data Handling**  
✅ **Custom X and Y Axis Labels**  
✅ **Tooltips with Dynamic Colors & Borders**  
✅ **Smooth Animations & Interactivity**  

---

## 📌 **Installation & Setup**

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/apache-echarts-nextjs.git
   cd apache-echarts-nextjs


npm install
npm run dev


📂 src
 ┣ 📂 components
 ┃ ┣ 📂 charts
 ┃ ┃ ┣ 📂 area
 ┃ ┃ ┃ ┣ 📜 ApacheAreaChart.tsx
 ┃ ┃ ┃ ┣ 📜 ApacheAreaChart.module.scss
 ┃ ┃ ┣ 📂 bar
 ┃ ┃ ┃ ┣ 📜 ApacheBarChart.tsx
 ┃ ┃ ┃ ┣ 📜 ApacheBarChart.module.scss
 ┃ ┃ ┣ 📂 common
 ┃ ┃ ┃ ┣ 📜 types.ts
 ┃ ┃ ┃ ┣ 📜 mockData.ts
 ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📜 ChartsPage.tsx
 ┣ 📜 README.md



We have implemented the following 2D charts using Apache ECharts:

#	Chart Name	Component Name
1	Area Chart	ApacheAreaChart.tsx
2	Bar Chart	ApacheBarChart.tsx
3	BoxPlot Chart	ApacheBoxPlotChart.tsx
4	Bubble Chart	ApacheBubbleChart.tsx
5	Candlestick Chart	ApacheCandlestickChart.tsx
6	Funnel Chart	ApacheFunnelChart.tsx
7	Gauge Chart	ApacheGaugeChart.tsx
8	Heatmap Chart	ApacheHeatmapChart.tsx
9	Line Chart	ApacheLineChart.tsx
10	Pie Chart	ApachePieChart.tsx
11	Radar Chart	ApacheRadarChart.tsx
12	Scatter Chart	ApacheScatterChart.tsx
13	Sankey Chart	ApacheSankeyChart.tsx
14	Treemap Chart	ApacheTreemapChart.tsx
15	Waterfall Chart	ApacheWaterfallChart.tsx
16	Chord Chart	ApacheChordChart.tsx
17	Sunburst Chart	ApacheSunburstChart.tsx
18	Force Graph Chart	ApacheForceGraphChart.tsx
19	Parallel Coordinates Chart	ApacheParallelChart.tsx
20	Polar Chart	ApachePolarChart.tsx
21	Geo Map Chart	ApacheGeoMapChart.tsx
22	Step Line Chart	ApacheStepLineChart.tsx
23	Stacked Area Chart	ApacheStackedAreaChart.tsx
24	Stacked Bar Chart	ApacheStackedBarChart.tsx
25	Grouped Bar Chart	ApacheGroupedBarChart.tsx
26	Stream Graph Chart	ApacheStreamGraphChart.tsx
27	Ribbon Chart	ApacheRibbonChart.tsx
28	Density Plot Chart	ApacheDensityPlotChart.tsx
29	Pyramid Chart	ApachePyramidChart.tsx
30	Histogram Chart	ApacheHistogramChart.tsx
31	Bullet Chart	ApacheBulletChart.tsx
32	Lollipop Chart	ApacheLollipopChart.tsx
33	Marimekko Chart	ApacheMarimekkoChart.tsx
34	Violin Chart	ApacheViolinChart.tsx
35	Dot Plot Chart	ApacheDotPlotChart.tsx


📌 Common Chart Properties
Each chart component accepts the following common props:

Prop Name	Type	Default Value	Description
title	string	"Chart"	Title of the chart
data	ChartData[]	[]	Data points for the chart
xAxisLabel	string	"X-Axis"	Label for the X-axis
yAxisLabel	string	"Y-Axis"	Label for the Y-axis
height	number	500	Chart height in pixels
width	number	"100%"	Chart width



📌 Customization Options
Each chart supports the following customization options:

🎨 Colors
Each chart automatically assigns different colors to data points.
Tooltips have dynamic colors matching the data points.
📏 Responsive Sizing
Height & Width can be adjusted using props.
🌙 Dark/Light Mode
Charts adapt dynamically using useTheme from next-themes.



📌 How to Add a New Chart
Create a new folder in charts/
Add YourChart.tsx & YourChart.module.scss
Implement logic using Apache ECharts
Import and use in ChartsPage.tsx

📌 Contributing
🚀 Feel free to contribute by adding new charts, improving tooltips, or optimizing existing ones! Open a PR and let’s build amazing visualizations together! 🎨📊




Area, Bar,BoxPlot,Bubble,CandleStick, Funnel,Gauge,Heatmap,Line,Pie,Radar,Scatter,Sankey,TreeMap,Waterfall,ChordChart, Sunbrust,ForceGraph, ParallelChart,PolarChart,GeoMapChart,3dbar,3d surface chart, StepLineChart,StackedAreaChart,StackedBarChart,GroupedBarChart,StreamGraphChart,ApacheRibbonChart,ApacheDensityPlotChart, Apache Pyramid Chart,ApacheHistogramChart,ApacheBulletChart,ApacheLollipopChart,ApacheMarimekkoChart,ApacheViolinChart,ApacheDumbbellChart,ApacheDotPlotChart