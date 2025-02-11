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
  
  
  export interface ApacheWaterfallChartProps {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    data?: { label: string; value: number }[];
  }
  

  export interface ApacheBubbleChartProps {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    data?: { x: number; y: number; size: number }[];
  }


  export interface ApacheCandlestickChartProps {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    data?: [string, number, number, number, number][]; // [Date, Open, High, Low, Close]
  }

  export interface ApacheSankeyChartProps {
    title?: string;
    data: {
      nodes: { name: string }[];
      links: { source: string; target: string; value: number }[];
    };
  }

  export interface ApacheChordChartProps {
    title?: string;
    data: { name: string; value: number; color?: string }[];
    links: { source: string; target: string; value: number; color?: string }[];
  }

  export interface ApacheSunburstChartProps {
    title?: string;
    data: ApacheSunburstNode[];
  }
  
  export interface ApacheSunburstNode {
    name: string;
    value?: number;
    children?: ApacheSunburstNode[];
    itemStyle?: { color?: string };
  }
  
  export interface ApacheForceGraphProps {
    title?: string;
    data: {
      nodes: { name: string; value: number; color?: string }[];
      links: { source: string; target: string }[];
    };
  }
  

  export interface ApacheParallelChartProps {
    title?: string;
    dimensions: string[];
    data: number[][];
  }
  

  export interface ApachePolarChartProps {
    title?: string;
    data: [string, number][];
  }
  

  export interface ApacheGeoMapChartProps {
    title?: string;
    data: { name: string; value: number }[];
  }
  
  
  
  


  
  
  
  
  
  