import { themes } from "../config/themes";

// src/components/charts/types/chart-types.ts
export interface ChartDimensions {
    width?: number | string;
    height?: number | string;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }
  
  export interface ChartDataPoint {
    [key: string]: number | string | Date;
  }
  
  export type ChartType = 
    | 'line'
    | 'area'
    | 'bar'
    | 'pie'
    | 'donut'
    | 'radar'
    | 'scatter'
    | 'composed';
  
  export interface ChartSeries {
    type: ChartType;
    dataKey: string;
    name: string;
    color?: string;
    gradient?: string;
    opacity?: number;
    yAxisId?: string | number;
    stackId?: string;
    hide?: boolean;
  }
  
  export interface ChartAxis {
    type?: 'number' | 'category' | 'time';
    dataKey?: string;
    name?: string;
    unit?: string;
    domain?: [number | string, number | string];
    tickFormatter?: (value: any) => string;
    hide?: boolean;
  }
  
  export interface ChartLegend {
    show?: boolean;
    position?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    onClick?: (dataKey: string) => void;
    onMouseEnter?: (dataKey: string) => void;
    onMouseLeave?: (dataKey: string) => void;
  }
  
  export interface ChartTooltip {
    show?: boolean;
    formatter?: (value: any, name?: string) => string;
    labelFormatter?: (label: string) => string;
    cursor?: boolean | object;
  }
  
  export interface BaseChartProps {
    data: ChartDataPoint[];
    dimensions?: ChartDimensions;
    series?: ChartSeries[];
    xAxis?: ChartAxis;
    yAxis?: ChartAxis | ChartAxis[];
    legend?: ChartLegend;
    tooltip?: ChartTooltip;
    theme?: keyof typeof themes;
    animate?: boolean;
    loading?: boolean;
  }
  