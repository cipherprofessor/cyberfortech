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


  export interface Bar3DChartProps {
    title?: string;
    data: { x: string; y: string; z: number }[]; // Ensure data is an array of objects
  }
  
  export interface Surface3DChartProps {
    title?: string;
    data: number[][][];
  }

  export interface Apache3DSurfaceChartProps {
    title?: string;
    data: number[][]; // Array of [x, y, z] values
  }

  export interface ApacheStepLineChartProps {
    title?: string;
    data: { x: string; y: number }[]; // X (category) and Y (value)
    xAxisLabel?: string; // Custom label for X-Axis
    yAxisLabel?: string; // Custom label for Y-Axis
    metricUnit?: string; // Optional unit for tooltip (e.g., "°C", "kg", "%")
  }

  export interface ApacheStackedAreaChartProps {
    title?: string;
    data: {
      x: string; // Ensure x is always a string
      Revenue: number;
      Expenses: number;
      Profit: number;
    }[];
    xAxisLabel?: string;
    yAxisLabel?: string;
  }
  

  export interface ApacheStackedBarChartProps {
    title?: string;
    data: { x: string; Revenue: number; Profit: number; Expenses: number }[];
    xAxisLabel?: string;
    yAxisLabel?: string;
  }

  export interface ApacheGroupedBarChartProps {
    title?: string;
    data: Array<{ x: string } & Record<string, number | string>>;
    xAxisLabel?: string;
    yAxisLabel?: string;
  }

  export type StreamGraphData = {
    x: string;
  } & Record<string, number>;
  
  export interface ApacheStreamGraphData {
      x: string;
      [key: string]: number | string;
    }

    export interface ApacheRibbonChartProps {
      title?: string;
      data: { source: string; target: string; value: number }[];
    }
    
    export interface ApacheStreamGraphChartProps {
      title?: string;
      data: { x: string; [key: string]: number | string }[];
      xAxisLabel?: string;
      yAxisLabel?: string;
    }
    

    export interface ApacheDensityPlotChartProps {
      title?: string;
      data: { x: string; [key: string]: number | string }[];
      xAxisLabel?: string;
      yAxisLabel?: string;
    }
    
    
    

    export interface ApachePyramidChartProps {
      title?: string;
      data: ApachePyramidChartData[];
      xAxisLabel?: string;
      yAxisLabel?: string;
    }
    
    export interface ApachePyramidChartData {
      category: string;
      value: number;
    }


    export interface ApacheHistogramChartProps {
      title?: string;
      data: ApacheHistogramChartData[];
      xAxisLabel?: string;
      yAxisLabel?: string;
      barWidth?: number;
    }
    
    export interface ApacheHistogramChartData {
      bin: string;
      frequency: number;
    }
    
    
    
 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


  
  
  
  
  
  