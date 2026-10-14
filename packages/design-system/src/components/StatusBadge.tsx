'use client';
import { clsx } from 'clsx';
import { Icon } from './Icon';

export interface StatusBadgeProps {
  status: 'valid' | 'invalid' | 'stale' | 'pending' | 'revoked' | 'expired' | 'synced' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  valid: { bg: 'bg-success-50', text: 'text-success-600', border: 'border-success-200', icon: 'check-circle', label: 'Valid' },
  invalid: { bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-200', icon: 'x-circle', label: 'Invalid' },
  stale: { bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-200', icon: 'clock', label: 'Stale' },
  pending: { bg: 'bg-surface-100', text: 'text-surface-600', border: 'border-surface-200', icon: 'loader', label: 'Pending' },
  revoked: { bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-200', icon: 'shield-x', label: 'Revoked' },
  expired: { bg: 'bg-surface-100', text: 'text-surface-600', border: 'border-surface-200', icon: 'calendar-x', label: 'Expired' },
  synced: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200', icon: 'refresh-cw', label: 'Synced' },
  offline: { bg: 'bg-surface-100', text: 'text-surface-600', border: 'border-surface-200', icon: 'wifi-off', label: 'Offline' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-1.5 text-base gap-2',
};

export function StatusBadge({ status, size = 'md', showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && <Icon name={config.icon} size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />}
      <span>{config.label}</span>
    </span>
  );
}