'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { Icon } from './Icon';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string; onClick?: () => void }>;
  className?: string;
}

export function PageHeader({ title, description, action, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={clsx('mb-8', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-surface-500 mb-4" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <Icon name="chevron-right" size={14} />}
              {crumb.href || crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className={clsx('hover:text-surface-700 transition-colors', crumb.href && 'underline')}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-surface-900 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-surface-600">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}