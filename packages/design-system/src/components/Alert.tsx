'use client';
import { clsx } from 'clsx';
import { Icon } from './Icon';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  className?: string;
  onClose?: () => void;
  title?: string;
}

const variants = {
  info: 'bg-primary-50 border-primary-200 text-primary-800',
  success: 'bg-success-50 border-success-200 text-success-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  danger: 'bg-danger-50 border-danger-200 text-danger-800',
};

const icons = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'x-circle',
};

export function Alert({ children, variant = 'info', className, onClose, title }: AlertProps) {
  return (
    <div
      className={clsx('relative p-4 rounded-xl border flex gap-3', variants[variant], className)}
      role="alert"
    >
      <Icon name={icons[variant]} size={20} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        <p className="text-sm">{children}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}