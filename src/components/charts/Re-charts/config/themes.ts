// src/components/charts/config/themes.ts
export interface ChartTheme {
    colors: string[];
    background: string;
    text: {
      primary: string;
      secondary: string;
      label: string;
    };
    grid: {
      line: string;
      opacity: number;
    };
    tooltip: {
      background: string;
      text: string;
      border: string;
    };
    axis: {
      line: string;
      text: string;
      opacity: number;
    };
  }
  
  export const themes = {
    light: {
      colors: [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // yellow
        '#EF4444', // red
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#06B6D4', // cyan
        '#F97316'  // orange
      ],
      background: '#FFFFFF',
      text: {
        primary: '#111827',
        secondary: '#4B5563',
        label: '#6B7280'
      },
      grid: {
        line: '#E5E7EB',
        opacity: 0.5
      },
      tooltip: {
        background: '#FFFFFF',
        text: '#111827',
        border: '#E5E7EB'
      },
      axis: {
        line: '#D1D5DB',
        text: '#6B7280',
        opacity: 1
      }
    },
    dark: {
      colors: [
        '#60A5FA', // blue
        '#34D399', // green
        '#FBBF24', // yellow
        '#F87171', // red
        '#A78BFA', // purple
        '#F472B6', // pink
        '#22D3EE', // cyan
        '#FB923C'  // orange
      ],
      background: '#1F2937',
      text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
        label: '#9CA3AF'
      },
      grid: {
        line: '#374151',
        opacity: 0.3
      },
      tooltip: {
        background: '#374151',
        text: '#F9FAFB',
        border: '#4B5563'
      },
      axis: {
        line: '#4B5563',
        text: '#9CA3AF',
        opacity: 0.8
      }
    },
    // Additional themes
    colorful: {
      colors: [
        '#FF6B6B', // coral
        '#4ECDC4', // turquoise
        '#FFD93D', // yellow
        '#95E1D3', // mint
        '#A8E6CF', // light green
        '#FF8B94', // pink
        '#6C5B7B', // purple
        '#FFE66D'  // light yellow
      ],
      background: '#FFFFFF',
      text: {
        primary: '#2C3E50',
        secondary: '#34495E',
        label: '#7F8C8D'
      },
      grid: {
        line: '#EAEAEA',
        opacity: 0.5
      },
      tooltip: {
        background: '#FFFFFF',
        text: '#2C3E50',
        border: '#EAEAEA'
      },
      axis: {
        line: '#BDC3C7',
        text: '#7F8C8D',
        opacity: 1
      }
    },
    minimal: {
      colors: [
        '#000000', // black
        '#404040', // dark gray
        '#737373', // medium gray
        '#A3A3A3', // light gray
        '#525252', // charcoal
        '#262626', // darker gray
        '#666666', // gray
        '#8C8C8C'  // lighter gray
      ],
      background: '#FFFFFF',
      text: {
        primary: '#000000',
        secondary: '#404040',
        label: '#737373'
      },
      grid: {
        line: '#E5E5E5',
        opacity: 0.5
      },
      tooltip: {
        background: '#FFFFFF',
        text: '#000000',
        border: '#E5E5E5'
      },
      axis: {
        line: '#D4D4D4',
        text: '#737373',
        opacity: 1
      }
    }
  };
  
  // Helper function to get theme colors with opacity
  export const getThemeColorWithOpacity = (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };