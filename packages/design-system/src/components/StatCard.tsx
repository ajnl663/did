'use client';
import { clsx } from 'clsx';
import { Icon } from './Icon';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'violet' | 'indigo';
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

// Static lookup maps — prevents Tailwind class purging in production
const bgColors: Record<string, string> = {
  primary: 'bg-primary-50',
  success: 'bg-success-50',
  warning: 'bg-warning-50',
  danger: 'bg-danger-50',
  violet: 'bg-violet-50',
  indigo: 'bg-indigo-50',
};

const textColors: Record<string, string> = {
  primary: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
  violet: 'text-violet-600',
  indigo: 'text-indigo-600',
};

const borderColors: Record<string, string> = {
  primary: 'border-l-primary-500',
  success: 'border-l-success-500',
  warning: 'border-l-warning-500',
  danger: 'border-l-danger-500',
  violet: 'border-l-violet-500',
  indigo: 'border-l-indigo-500',
};

export function StatCard({ label, value, change, changePositive, icon, color, className, trend, onClick }: StatCardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-surface-200 shadow-card p-5',
        'border-l-4', borderColors[color],
        onClick && 'cursor-pointer hover:shadow-card-hover transition-shadow duration-200 active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-surface-500 uppercase tracking-wide truncate">{label}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1.5 tabular-nums">{value}</p>
          {change && (
            <div className={clsx(
              'mt-1.5 flex items-center gap-1 text-xs font-medium',
              changePositive ? 'text-success-600' : 'text-danger-600'
            )}>
              {trend === 'up' && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5H7z" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', bgColors[color])}>
          <Icon name={icon} size={22} className={textColors[color]} />
        </div>
      </div>
    </div>
  );
}