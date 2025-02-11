// src/components/charts/components/Legend.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LegendItem {
  name: string;
  color: string;
  value?: number | string;
  active?: boolean;
}

interface LegendProps {
  items: LegendItem[];
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  layout?: 'horizontal' | 'vertical';
  onClick?: (item: LegendItem, index: number) => void;
  onHover?: (item: LegendItem, index: number) => void;
}

export const Legend: React.FC<LegendProps> = ({
  items,
  align = 'right',
  verticalAlign = 'middle',
  layout = 'vertical',
  onClick,
  onHover,
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const verticalAlignClasses = {
    top: 'items-start',
    middle: 'items-center',
    bottom: 'items-end',
  };

  return (
    <div
      className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} 
        gap-3 ${alignmentClasses[align]} ${verticalAlignClasses[verticalAlign]}`}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-2 cursor-pointer 
            ${item.active === false ? 'opacity-50' : ''}`}
          onClick={() => onClick?.(item, index)}
          onMouseEnter={() => onHover?.(item, index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.name}
            </span>
            {item.value && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.value}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Usage example:
const legendItems = [
  { name: 'Revenue', color: '#3B82F6', value: '$4,000' },
  { name: 'Profit', color: '#10B981', value: '$2,500' },
  { name: 'Loss', color: '#EF4444', value: '$1,500' },
];

<Legend 
  items={legendItems}
  align="right"
  verticalAlign="middle"
  layout="vertical"
  onClick={(item, index) => console.log('Clicked:', item.name)}
  onHover={(item, index) => console.log('Hovered:', item.name)}
/>