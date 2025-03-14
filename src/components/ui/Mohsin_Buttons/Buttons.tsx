import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import styles from './Button.module.scss';

// Define button variants and sizes using CVA (Class Variance Authority)
const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      filled: styles.filled,
      outline: styles.outline,
    },
    color: {
      primary: styles.primary,      // Green
      secondary: styles.secondary,  // Blue 
      warning: styles.warning,      // Yellow
      danger: styles.danger,        // Red
      info: styles.info,            // Blue
      default: styles.default,      // Gray
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    iconPosition: {
      left: styles.iconLeft,
      right: styles.iconRight,
    },
  },
  defaultVariants: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
  },
});

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children?: React.ReactNode;
  className?: string;
  variant?: 'filled' | 'outline';
  color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'outline',
    color = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    isLoading = false,
    loadingText,
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            color,
            size,
            iconPosition: Icon ? iconPosition : undefined,
            className,
          })
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} />
            {loadingText || children}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className={styles.icon} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className={styles.icon} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };