'use client';
import { clsx } from 'clsx';
import { Card } from './Card';
import { Icon } from './Icon';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'pink';
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, change, changePositive, icon, color, className, trend }: StatCardProps) {
  return (
    <Card variant="elevated" padding="lg" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-surface-500 truncate">{label}</p>
          <p className="text-3xl font-bold text-surface-900 mt-1 truncate">{value}</p>
          {change && (
            <div className={clsx('mt-2 flex items-center gap-1 text-sm', changePositive ? 'text-success-600' : 'text-danger-600')}>
              <Icon name={trend === 'up' ? 'chevron-up' : trend === 'down' ? 'chevron-down' : 'minus'} size={14} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', `bg-${color}-50`)}>
          <Icon name={icon} size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </Card>
  );
}