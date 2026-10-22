import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'warning' | 'danger' | 'success';

const alertConfig: Record<AlertVariant, { bg: string; border: string; text: string; icon: any }> = {
  info: { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-800', icon: Info },
  warning: { bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-800', icon: AlertTriangle },
  danger: { bg: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-800', icon: XCircle },
  success: { bg: 'bg-success-50', border: 'border-success-200', text: 'text-success-800', icon: CheckCircle2 },
};

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className }: AlertProps) {
  const config = alertConfig[variant];
  const AlertIcon = config.icon;
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg border', config.bg, config.border, config.text, className)}>
      <AlertIcon size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}
