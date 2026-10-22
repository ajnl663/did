import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 'valid' | 'revoked' | 'expired' | 'pending' | 'offline';

const statusConfig: Record<StatusType, { variant: 'success' | 'destructive' | 'warning' | 'secondary'; label: string }> = {
  valid: { variant: 'success', label: 'Valid' },
  revoked: { variant: 'destructive', label: 'Revoked' },
  expired: { variant: 'warning', label: 'Expired' },
  pending: { variant: 'warning', label: 'Pending' },
  offline: { variant: 'secondary', label: 'Offline' },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'lg';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.offline;
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
