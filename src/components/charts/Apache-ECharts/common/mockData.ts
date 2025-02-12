import { ApacheGroupedBarChartProps, ApacheStackedAreaChartProps, BarChartData, ChartDataPoint } from "./types";


export const lineChartData: ChartDataPoint[] = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 20 },
  { label: "Mar", value: 18 },
  { label: "Apr", value: 30 },
  { label: "May", value: 25 },
  { label: "Jun", value: 40 },
];

  


  export const barChartData: BarChartData[] = [
    { label: "Jan", value: 120 },
    { label: "Feb", value: 200 },
    { label: "Mar", value: 999 },
    { label: "Apr", value: 250 },
    { label: "May", value: 300 },
    { label: "Jun", value: 180 },
  ];
  

  export const pieChartData = [
    { label: "Category A", value: 30 },
    { label: "Category B", value: 20 },
    { label: "Category C", value: 25 },
    { label: "Category D", value: 15 },
    { label: "Category E", value: 10 },
  ];

  export const areaChartData = [
    {
      name: "Revenue",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [320, 450, 300, 500, 610, 490],
    },
    {
      name: "Profit",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [210, 390, 280, 999, 520, 410],
    },
    {
      name: "Expenses",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [100, 200, 150, 300, 400, 350],
    },
  ];


  export const radarChartData = {
    categories: ["Speed", "Efficiency", "Accuracy", "Flexibility", "Consistency"],
    series: [
      {
        name: "System A",
        data: [85, 70, 90, 80, 75],
      },
      {
        name: "System B",
        data: [70, 80, 60, 85, 95],
      },
      {
        name: "System C",
        data: [90, 85, 80, 75, 70],
      },
    ],
  };


  export const funnelChartData = [
    { name: "Visitors", value: 100 },
    { name: "Sign-ups", value: 80 },
    { name: "Users", value: 60 },
    { name: "Subscribers", value: 40 },
    { name: "Premium Users", value: 20 },
  ];
  

  export const scatterChartData = [
    [10, 2],  // Speed: 10 km/h, Distance: 2 km
    [15, 5],
    [30, 10],
    [40, 15],
    [50, 22],
    [60, 30],
    [70, 42],
    [80, 55],
    [90, 70],
  ];

  export const heatmapChartData = {
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    yLabels: ["Morning", "Afternoon", "Evening"],
    data: [
      [0, 0, 30], [0, 1, 60], [0, 2, 90],
      [1, 0, 10], [1, 1, 50], [1, 2, 80],
      [2, 0, 20], [2, 1, 70], [2, 2, 100],
      [3, 0, 40], [3, 1, 90], [3, 2, 30],
      [4, 0, 50], [4, 1, 60], [4, 2, 70],
      [5, 0, 80], [5, 1, 40], [5, 2, 60],
      [6, 0, 90], [6, 1, 20], [6, 2, 50],
    ],
  };


  export const gaugeChartData = [
    { value: 70, name: "Performance" },
  ];

  export const treeMapData = [
    { name: "Category A", value: 100 },
    { name: "Category B", value: 80 },
    { name: "Category C", value: 60 },
    { name: "Category D", value: 40 },
    { name: "Category E", value: 20 },
  ];
  
  
  
  
  export const mockTreemapData = [
    { name: "Electronics", value: 120 },
    { name: "Fashion", value: 80 },
    { name: "Home Decor", value: 50 },
    { name: "Books", value: 30 },
    { name: "Beauty", value: 25 },
  ];
  
 
  export const boxplotData = [
    [655, 850, 940, 980, 1070],
    [760, 800, 845, 865, 930],
    [740, 780, 810, 870, 920],
    [680, 720, 760, 800, 850],
    [690, 740, 790, 810, 870],
  ];
  
  export const waterfallChartData = [
    { label: "Start", value: 3000 },
    { label: "Q1", value: -1200 },
    { label: "Q2", value: 800 },
    { label: "Q3", value: -600 },
    { label: "Q4", value: 900 },
    { label: "End", value: 3900 },
  ];
  
  
  
  export const bubbleChartData = [
    { x: 10, y: 20, size: 15 },
    { x: 20, y: 30, size: 25 },
    { x: 30, y: 10, size: 10 },
    { x: 40, y: 50, size: 30 },
    { x: 50, y: 40, size: 20 },
  ];

  export const candlestickData: [string, number, number, number, number][] = [
    ["2024-02-01", 110, 130, 105, 125], // [Date, Open, High, Low, Close]
    ["2024-02-02", 125, 10, 120, 100],
    ["2024-02-03", 135, 145, 130, 140],
    ["2024-02-04", 140, 150, 135, 145],
    ["2024-02-05", 145, 155, 140, 150],
  ];


  export const sankeyChartData = {
    nodes: [
      { name: "Source A" },
      { name: "Source B" },
      { name: "Source C" },
      { name: "Target X" },
      { name: "Target Y" },
    ],
    links: [
      { source: "Source A", target: "Target X", value: 10 },
      { source: "Source B", target: "Target X", value: 15 },
      { source: "Source C", target: "Target Y", value: 20 },
    ],
  };


  export const chordChartData = {
    nodes: [
      { name: "Node A", value: 30, color: "#FF5733" },
      { name: "Node B", value: 50, color: "#33FF57" },
      { name: "Node C", value: 40, color: "#3399FF" },
      { name: "Node D", value: 35, color: "#FFD700" },
    ],
    links: [
      { source: "Node A", target: "Node B", value: 10, color: "#FF5733" },
      { source: "Node A", target: "Node C", value: 20, color: "#33FF57" },
      { source: "Node B", target: "Node D", value: 15, color: "#3399FF" },
      { source: "Node C", target: "Node D", value: 25, color: "#FFD700" },
    ],
  };
  

  export const sunburstChartData = [
    {
      name: "Category A",
      children: [
        {
          name: "Subcategory A1",
          value: 10,
          itemStyle: { color: "#FF5733" },
        },
        {
          name: "Subcategory A2",
          children: [
            { name: "Item A2-1", value: 5, itemStyle: { color: "#FFC300" } },
            { name: "Item A2-2", value: 7, itemStyle: { color: "#FF5733" } },
          ],
        },
      ],
    },
    {
      name: "Category B",
      children: [
        { name: "Subcategory B1", value: 15, itemStyle: { color: "#33FF57" } },
        { name: "Subcategory B2", value: 12, itemStyle: { color: "#3399FF" } },
      ],
    },
  ];
  


  export const forceGraphData = {
    nodes: [
      { name: "Node A", value: 20, color: "#FF5733" },
      { name: "Node B", value: 25, color: "#33FF57" },
      { name: "Node C", value: 15, color: "#3399FF" },
      { name: "Node D", value: 30, color: "#FFD700" },
    ],
    links: [
      { source: "Node A", target: "Node B" },
      { source: "Node B", target: "Node C" },
      { source: "Node C", target: "Node D" },
      { source: "Node D", target: "Node A" },
    ],
  };
  

  export const parallelChartData = {
    dimensions: ["Speed", "Acceleration", "Efficiency", "Power", "Torque", "Fuel Consumption"],
    data: [
      [90, 120, 80, 100, 70, 30],
      [70, 110, 85, 95, 65, 40],
      [80, 130, 70, 110, 75, 35],
      [100, 140, 75, 105, 80, 25],
      [85, 125, 90, 120, 60, 45],
      [95, 115, 78, 108, 68, 38],
      [78, 135, 82, 115, 72, 28],
      [88, 128, 76, 102, 74, 33],
      [92, 140, 84, 118, 69, 27],
      [86, 122, 88, 125, 73, 31],
    ],
  };
  
  
  export const polarChartData: [string, number][] = [
    ["A", 40],
    ["B", 80],
    ["C", 60],
    ["D", 100],
    ["E", 70],
    ["F", 50],
  ];
  

  export const geoMapData = [
    { name: "United States", value: 500 },
    { name: "China", value: 700 },
    { name: "India", value: 600 },
    { name: "Brazil", value: 300 },
    { name: "Russia", value: 400 },
  ];
  


  export const bar3DChartData: { x: string; y: string; z: number }[] = [
    { x: "A", y: "Category 1", z: 50 },
    { x: "B", y: "Category 2", z: 80 },
    { x: "C", y: "Category 3", z: 30 },
    { x: "D", y: "Category 4", z: 90 },
    { x: "E", y: "Category 5", z: 70 },
  ];
  
  
  export const surface3DChartData: [number, number, number][] = [];
for (let i = -10; i <= 10; i++) {
  for (let j = -10; j <= 10; j++) {
    const z = Math.sin(i) * Math.cos(j); // Example function for Z values
    surface3DChartData.push([i, j, z]);
  }
}


export const stepLineChartData = [
  { x: "Jan", y: 10 },
  { x: "Feb", y: 15 },
  { x: "Mar", y: 12 },
  { x: "Apr", y: 18 },
  { x: "May", y: 20 },
  { x: "Jun", y: 22 },
  { x: "Jul", y: 25 },
  { x: "Aug", y: 28 },
  { x: "Sep", y: 30 },
  { x: "Oct", y: 32 },
  { x: "Nov", y: 35 },
  { x: "Dec", y: 38 },
];

// Example for temperature trends
export const temperatureStepLineData = [
  { x: "Monday", y: 12 },
  { x: "Tuesday", y: 15 },
  { x: "Wednesday", y: 14 },
  { x: "Thursday", y: 18 },
  { x: "Friday", y: 21 },
  { x: "Saturday", y: 19 },
  { x: "Sunday", y: 17 },
];



 
export const stackedAreaChartData: ApacheStackedAreaChartProps["data"] = [
  { x: "Jan", Revenue: 12000, Expenses: 8000, Profit: 4000 },
  { x: "Feb", Revenue: 15000, Expenses: 9000, Profit: 6000 },
  { x: "Mar", Revenue: 18000, Expenses: 10000, Profit: 8000 },
  { x: "Apr", Revenue: 20000, Expenses: 11000, Profit: 9000 },
  { x: "May", Revenue: 22000, Expenses: 12000, Profit: 10000 },
];

export const stackedBarChartData: { x: string; Revenue: number; Profit: number; Expenses: number }[] = [
  { x: "Q1", Revenue: 5000, Profit: 1200, Expenses: 3000 },
  { x: "Q2", Revenue: 7000, Profit: 1500, Expenses: 4000 },
  { x: "Q3", Revenue: 6500, Profit: 1400, Expenses: 3800 },
  { x: "Q4", Revenue: 8000, Profit: 2000, Expenses: 5000 },
];


export const groupedBarChartData: ApacheGroupedBarChartProps["data"] = [
  { x: "Jan", ProductA: 120, ProductB: 180, ProductC: 90 },
  { x: "Feb", ProductA: 150, ProductB: 160, ProductC: 110 },
  { x: "Mar", ProductA: 170, ProductB: 190, ProductC: 130 },
  { x: "Apr", ProductA: 140, ProductB: 200, ProductC: 120 },
];









