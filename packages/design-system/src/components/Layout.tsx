'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function Layout({ children, header, footer, sidebar, className }: LayoutProps) {
  return (
    <div className={clsx('min-h-screen bg-surface-50 flex flex-col', className)}>
      {header && <header className="sticky top-0 z-40 bg-white border-b border-surface-200">{header}</header>}
      <div className="flex flex-1">
        {sidebar && (
          <aside className="w-64 bg-white border-r border-surface-200 hidden lg:block">{sidebar}</aside>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      {footer && <footer className="bg-white border-t border-surface-200 p-4">{footer}</footer>}
    </div>
  );
}

export interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function PageContainer({ children, maxWidth = 'lg', className }: PageContainerProps) {
  const widths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[90rem]',
    full: 'max-full',
  };
  return (
    <div className={clsx('mx-auto w-full px-4 sm:px-6 lg:px-8', widths[maxWidth], className)}>
      {children}
    </div>
  );
}