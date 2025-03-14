import React from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={clsx(
        styles.skeleton,
        styles[variant],
        styles[animation],
        theme === 'dark' && styles.dark,
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  );
};

export default Skeleton;