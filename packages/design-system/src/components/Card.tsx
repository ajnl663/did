'use client';
import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'violet';
}

const accentBorders = {
  primary: 'border-l-4 border-l-primary-500',
  success: 'border-l-4 border-l-success-500',
  warning: 'border-l-4 border-l-warning-500',
  danger: 'border-l-4 border-l-danger-500',
  violet: 'border-l-4 border-l-violet-500',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover, interactive, accent, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-surface-200',
      outlined: 'bg-white border-2 border-surface-300',
      elevated: 'bg-white shadow-card border border-surface-100',
      flat: 'bg-surface-50',
    };
    const paddings = {
      none: '',
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl overflow-hidden',
          'transition-shadow duration-200',
          variants[variant],
          paddings[padding],
          accent && accentBorders[accent],
          (hover || interactive) && 'hover:shadow-card-hover',
          interactive && 'cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';