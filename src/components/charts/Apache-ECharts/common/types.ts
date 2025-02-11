export interface BarChartData {
    label: string;
    value: number;
  }

export type ChartDataPoint = {
    label: string;
    value: number;
  };
  
  export interface HeatmapChartProps {
    title: string;
  }

  export interface ApacheGaugeChartProps {
    title: string;
    data: { value: number; name: string }[];
  }
  
  export interface ChartData {
    name: string;
    value: number;
  }
  export interface ApacheBoxplotChartProps {
    title?: string;
    data?: number[][]; // Array of arrays for boxplot data
    xAxisLabel?: string; // Custom X-axis label
    yAxisLabel?: string; // Custom Y-axis label
  }
  
  
  
  
  