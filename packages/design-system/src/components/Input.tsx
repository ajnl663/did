'use client';
import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Accepts both native event handler and string shorthand (value: string) => void */
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | ((value: string) => void);
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, fullWidth, id, size = 'md', onChange, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || `input-${Math.random().toString(36).slice(2, 7)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      // Support both (e) => void and (value: string) => void call signatures
      if (onChange.length === 1) {
        try {
          (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
        } catch {
          (onChange as (value: string) => void)(e.target.value);
        }
      } else {
        (onChange as (value: string) => void)(e.target.value);
      }
    };

    const sizes = {
      sm: 'py-1.5 text-sm',
      md: 'py-2.5 text-sm',
      lg: 'py-3 text-base',
    };

    return (
      <div className={clsx('w-full', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border bg-white text-surface-900 placeholder-surface-400',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              sizes[size],
              error
                ? 'border-danger-400 focus:ring-danger-500 bg-danger-50/30'
                : 'border-surface-300 hover:border-surface-400 focus:ring-primary-500',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            onChange={handleChange}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-surface-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-danger-600 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-xs text-surface-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';