'use client';
import { clsx } from 'clsx';
import { Icon } from './Icon';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'square';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const iconSizes: Record<string, number> = { xs: 10, sm: 14, md: 18, lg: 22, xl: 28 };

const bgColors = [
  'bg-primary-500', 'bg-success-500', 'bg-warning-500', 'bg-danger-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
];

export function Avatar({ src, alt, name, size = 'md', className, shape = 'circle' }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorIndex = name ? name.charCodeAt(0) % bgColors.length : 0;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={clsx('rounded-full object-cover', sizeClasses[size], shape === 'square' && 'rounded-lg', className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center font-medium text-white rounded-full',
        sizeClasses[size],
        shape === 'square' && 'rounded-lg',
        bgColors[colorIndex],
        className
      )}
      aria-label={name}
    >
      {initials || <Icon name="user" size={iconSizes[size]} />}
    </div>
  );
}
