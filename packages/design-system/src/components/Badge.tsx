'use client';
import { clsx } from 'clsx';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variants = {
  default: 'bg-surface-100 text-surface-700',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  outline: 'bg-transparent text-surface-600 border border-surface-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const dotColors: Record<string, string> = {
  default: 'bg-surface-400',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  outline: 'bg-surface-400',
};

export function Badge({ variant = 'default', size = 'md', dot, className, children }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 font-medium rounded-full', variants[variant], sizes[size], className)}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}