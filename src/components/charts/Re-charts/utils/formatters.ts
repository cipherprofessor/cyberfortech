  // src/components/charts/utils/formatters.ts
  export const formatters = {
    // Number formatters
    number: (value: number, decimals = 0): string => {
      return Number(value).toFixed(decimals);
    },
  
    currency: (value: number, currency = 'USD', locale = 'en-US'): string => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(value);
    },
  
    percentage: (value: number, decimals = 1): string => {
      return `${Number(value).toFixed(decimals)}%`;
    },
  
    compact: (value: number, locale = 'en-US'): string => {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    },
  
    // Date formatters
    date: (value: Date | string, locale = 'en-US'): string => {
      const date = new Date(value);
      return date.toLocaleDateString(locale);
    },
  
    time: (value: Date | string, locale = 'en-US'): string => {
      const date = new Date(value);
      return date.toLocaleTimeString(locale);
    },
  
    datetime: (value: Date | string, locale = 'en-US'): string => {
      const date = new Date(value);
      return date.toLocaleString(locale);
    },
  
    // Duration formatters
    duration: (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
  
      if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${remainingSeconds}s`;
    },
  
    // Size formatters
    fileSize: (bytes: number): string => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Byte';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
    },
  
    // Value formatters for specific chart types
    axisLabel: (value: any, maxLength = 15): string => {
      if (typeof value === 'string' && value.length > maxLength) {
        return `${value.substring(0, maxLength)}...`;
      }
      return String(value);
    },
  
    tooltipValue: (value: number, type: 'currency' | 'percentage' | 'number' = 'number'): string => {
      switch (type) {
        case 'currency':
          return formatters.currency(value);
        case 'percentage':
          return formatters.percentage(value);
        default:
          return formatters.number(value);
      }
    },
  
    // Specialized formatters for specific use cases
    growth: (value: number): string => {
      const formatted = formatters.percentage(Math.abs(value));
      return value >= 0 ? `+${formatted}` : `-${formatted}`;
    },
  
    metricValue: (value: number, threshold: number = 1000): string => {
      return value >= threshold ? formatters.compact(value) : formatters.number(value);
    },
  
    timeAgo: (date: Date | string): string => {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
      if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return formatters.date(date);
    }
  };
  
  // Export default configurations
  export const defaultFormatConfig = {
    locale: 'en-US',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'HH:mm:ss',
    numberDecimals: 2,
    percentageDecimals: 1,
    compactNotation: true
  };