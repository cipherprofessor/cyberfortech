// src/components/charts/components/Tooltip.tsx
import React from 'react';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency?: boolean;
  formatter?: (value: any) => string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  currency = false,
  formatter
}: TooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg 
      border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
      <p className="text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-gray-900 dark:text-white font-medium">
            {entry.name}: {' '}
            {formatter 
              ? formatter(entry.value)
              : currency 
                ? `$${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};