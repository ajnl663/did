'use client';
import { clsx } from 'clsx';
import { Button } from './Button';
import { Icon } from './Icon';

export interface VoiceToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  variant?: 'switch' | 'button';
  label?: string;
  className?: string;
}

export function VoiceToggle({ enabled, onChange, variant = 'switch', label, className }: VoiceToggleProps) {
  if (variant === 'button') {
    return (
      <Button
        variant={enabled ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onChange(!enabled)}
        className={clsx('gap-2', className)}
        aria-pressed={enabled}
      >
        <Icon name={enabled ? 'volume-2' : 'volume-x'} size={18} />
        <span>{label || (enabled ? 'Voice On' : 'Voice Off')}</span>
      </Button>
    );
  }

  return (
    <label className={clsx('flex items-center gap-3 cursor-pointer', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          enabled ? 'bg-primary-600' : 'bg-surface-300'
        )}
        aria-label={label || 'Voice assistance'}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-card transition-transform',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      <span className="text-sm font-medium text-surface-700">{label || (enabled ? 'Voice On' : 'Voice Off')}</span>
    </label>
  );
}