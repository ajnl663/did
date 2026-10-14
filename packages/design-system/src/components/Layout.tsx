'use client';
import { ReactNode, useState, useEffect } from 'react';
import { clsx } from 'clsx';

export interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function Layout({ children, header, footer, sidebar, className }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change / resize
  useEffect(() => {
    const close = () => setSidebarOpen(false);
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  return (
    <div className={clsx('min-h-screen bg-surface-50 flex flex-col', className)}>
      {/* Top header */}
      {header && (
        <div className="sticky top-0 z-40 h-14 bg-white border-b border-surface-200 shadow-sm flex-shrink-0">
          {/* Mobile hamburger */}
          {sidebar && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              aria-label="Open navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          {header}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        {sidebar && (
          <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-sidebar-DEFAULT border-r border-sidebar-border overflow-y-auto scrollbar-thin">
            {sidebar}
          </aside>
        )}

        {/* Mobile sidebar drawer */}
        {sidebar && (
          <>
            {/* Overlay */}
            <div
              className={clsx(
                'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
                sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <aside
              className={clsx(
                'fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-DEFAULT flex flex-col',
                'transition-transform duration-300 ease-out lg:hidden',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              )}
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-colors"
                aria-label="Close navigation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {sidebar}
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {footer && (
        <footer className="bg-white border-t border-surface-200 p-4 flex-shrink-0">
          {footer}
        </footer>
      )}
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
    full: 'w-full',
  };
  return (
    <div className={clsx('mx-auto w-full', widths[maxWidth], className)}>
      {children}
    </div>
  );
}