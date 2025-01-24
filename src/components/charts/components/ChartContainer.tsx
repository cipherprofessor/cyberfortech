// src/components/charts/components/ChartContainer.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const ChartContainer = ({
  title,
  subtitle,
  children,
  action,
  className = '',
  loading = false
}: ChartContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {(title || action) && (
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 relative">
        {loading ? (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 
            flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : null}
        {children}
      </div>
    </motion.div>
  );
};

