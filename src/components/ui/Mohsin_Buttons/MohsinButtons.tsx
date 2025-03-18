import React, { forwardRef, useRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, X } from 'lucide-react';
import styles from './MohsinButton.module.scss';

// Define button variants and sizes
const buttonVariants = {
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
    blue: styles.blue,            // Blue
  },
  size: {
    xs: styles.xs,
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  },
  iconPosition: {
    left: styles.iconLeft,
    right: styles.iconRight,
  },
};

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'color'> {
  children?: React.ReactNode;
  className?: string;
  variant?: 'filled' | 'outline';
  color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'info' | 'default' | 'blue';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingText?: string;
  animation?: 'bounce' | 'pulse' | 'rotate' | 'scale' | 'none';
}

const MohsinButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
    animation = 'none',
    onClick,
    ...props
  }, ref) => {
    const rippleRef = useRef<HTMLSpanElement>(null);

    // Enhanced ripple effect handler
    const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!rippleRef.current) return;

      const button = event.currentTarget;
      const ripple = rippleRef.current;
      
      // Reset the animation
      ripple.style.animation = 'none';
      
      // Calculate position
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Position the ripple at the click point
      ripple.style.top = `${y}px`;
      ripple.style.left = `${x}px`;
      ripple.style.marginLeft = '0';
      ripple.style.marginTop = '0';
      
      // Force reflow and restart animation
      void ripple.offsetWidth; // Trigger reflow
      ripple.style.animation = 'ripple 0.6s linear';
      
      // Call the original onClick handler
      if (onClick) onClick(event);
    };

    // Combine all the classes based on props
    const buttonClass = cn(
      styles.button,
      buttonVariants.variant[variant],
      buttonVariants.color[color],
      buttonVariants.size[size],
      Icon && buttonVariants.iconPosition[iconPosition],
      animation !== 'none' && styles[animation],
      className
    );

    // Animation variants for the button
    const buttonAnimation = {
      tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
      },
      hover: {
        scale: 1.03,
        transition: { duration: 0.2 }
      },
      bounce: {
        y: [0, -4, 0],
        transition: { 
          duration: 0.5,
          times: [0, 0.5, 1],
          repeat: 0
        }
      },
      pulse: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.5,
          times: [0, 0.5, 1],
          repeat: 0
        }
      },
      rotate: {
        rotate: [0, 20, 0, -20, 0],
        transition: {
          duration: 0.6,
          times: [0, 0.25, 0.5, 0.75, 1],
          repeat: 0
        }
      },
      scale: {
        scale: [1, 1.2, 1],
        transition: {
          duration: 0.5,
          times: [0, 0.5, 1],
          repeat: 0
        }
      }
    };

    // Define animation based on action type
    const getWhileTap = () => {
      if (animation === 'none') return buttonAnimation.tap;
      return buttonAnimation[animation];
    };

    return (
      <motion.button
        className={buttonClass}
        disabled={disabled || isLoading}
        ref={ref}
        whileHover={!disabled ? buttonAnimation.hover : undefined}
        whileTap={!disabled ? getWhileTap() : undefined}
        onClick={!disabled ? handleRipple : undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} />
            {loadingText || children}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <motion.span className={styles.iconWrapper}>
                <Icon className={styles.icon} />
              </motion.span>
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <motion.span className={styles.iconWrapper}>
                <Icon className={styles.icon} />
              </motion.span>
            )}
          </>
        )}

        {/* Enhanced ripple effect overlay */}
        <span ref={rippleRef} className={styles.ripple}></span>
      </motion.button>
    );
  }
);

MohsinButton.displayName = 'MohsinButton';

export { MohsinButton };