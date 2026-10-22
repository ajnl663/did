import { cn } from '@/lib/utils';
import { Icon } from './Icon';

const bgColors: Record<string, string> = {
  primary: 'bg-primary-50',
  success: 'bg-success-50',
  warning: 'bg-warning-50',
  danger: 'bg-danger-50',
};

const textColors: Record<string, string> = {
  primary: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
};

const borderColors: Record<string, string> = {
  primary: 'border-l-primary-500',
  success: 'border-l-success-500',
  warning: 'border-l-warning-500',
  danger: 'border-l-danger-500',
};

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export function StatCard({ label, value, change, changePositive, icon, color, className, trend, onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-surface-200 shadow-card p-5 border-l-4',
        borderColors[color],
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
            <div className={cn(
              'mt-1.5 flex items-center gap-1 text-xs font-medium',
              changePositive ? 'text-success-600' : 'text-danger-600'
            )}>
              {trend === 'up' && <Icon name="trending-up" size={12} />}
              {trend === 'down' && <Icon name="trending-down" size={12} />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', bgColors[color])}>
          <Icon name={icon} size={22} className={textColors[color]} />
        </div>
      </div>
    </div>
  );
}
