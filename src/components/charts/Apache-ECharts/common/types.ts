export interface BarChartData {
    label: string;
    value: number;
  }

export type ChartDataPoint = {
    label: string;
    value: number;
  };
  
  // export type ChartDataPoint = {
  //   label: string;
  //   value: number;
  // };
  
  export const pieChartData = [
    { label: "Category A", value: 30 },
    { label: "Category B", value: 20 },
    { label: "Category C", value: 25 },
    { label: "Category D", value: 15 },
    { label: "Category E", value: 10 },
  ];