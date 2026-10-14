'use client';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, disabled, children, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center font-medium rounded-xl',
      'transition-all duration-150 cursor-pointer select-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.98]',
    ].join(' ');

    const variants = {
      primary: [
        'bg-primary-600 text-white',
        'hover:bg-primary-700',
        'focus-visible:ring-primary-500',
        'shadow-sm hover:shadow',
      ].join(' '),
      secondary: [
        'bg-surface-100 text-surface-800',
        'hover:bg-surface-200',
        'focus-visible:ring-surface-400',
      ].join(' '),
      outline: [
        'border border-surface-300 bg-white text-surface-700',
        'hover:bg-surface-50 hover:border-surface-400',
        'focus-visible:ring-surface-400',
      ].join(' '),
      ghost: [
        'text-surface-600 bg-transparent',
        'hover:bg-surface-100 hover:text-surface-900',
        'focus-visible:ring-surface-400',
      ].join(' '),
      danger: [
        'bg-danger-600 text-white',
        'hover:bg-danger-700',
        'focus-visible:ring-danger-500',
        'shadow-sm',
      ].join(' '),
      success: [
        'bg-success-600 text-white',
        'hover:bg-success-700',
        'focus-visible:ring-success-500',
        'shadow-sm',
      ].join(' '),
      icon: [
        'text-surface-500 bg-transparent',
        'hover:bg-surface-100 hover:text-surface-700',
        'focus-visible:ring-surface-400',
      ].join(' '),
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs gap-1',
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2',
      xl: 'px-6 py-3 text-base gap-2.5',
    };

    const iconSizes = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
    };

    const sizeClass = variant === 'icon' ? iconSizes[size] : sizes[size];

    return (
      <button
        ref={ref}
        className={clsx(
          base,
          variants[variant],
          sizeClass,
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className={clsx(
              'animate-spin flex-shrink-0',
              size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
            )}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';