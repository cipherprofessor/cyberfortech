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
    { label: "Mar", value: 150 },
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
      values: [210, 390, 280, 450, 520, 410],
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
    [10, 20],
    [15, 35],
    [30, 45],
    [40, 55],
    [50, 60],
    [60, 75],
    [70, 85],
    [80, 90],
    [90, 100],
  ];
  
  
  
  
  