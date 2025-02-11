import { BarChartData, ChartDataPoint } from "./types";


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
  
  
  
  
  