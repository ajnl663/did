'use client';
import { useState } from 'react';
import { clsx } from 'clsx';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'pills' | 'enclosed';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'line', fullWidth, className }: TabsProps) {
  const variants = {
    line: 'border-b border-surface-200',
    pills: 'gap-1 bg-surface-100 p-1 rounded-xl',
    enclosed: 'gap-1',
  };

  const tabStyles = {
    line: (active: boolean) =>
      clsx(
        'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
        active ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
      ),
    pills: (active: boolean) =>
      clsx(
        'px-4 py-2 text-sm font-medium rounded-lg transition-all',
        active ? 'bg-white text-primary-600 shadow-card' : 'text-surface-600 hover:text-surface-900'
      ),
    enclosed: (active: boolean) =>
      clsx(
        'px-4 py-2 text-sm font-medium rounded-lg border transition-all',
        active ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
      ),
  };

  return (
    <div role="tablist" aria-label="Tabs" className={clsx(variants[variant], fullWidth && 'w-full', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={clsx(tabStyles[variant](activeTab === tab.id), tab.disabled && 'opacity-50 cursor-not-allowed', 'flex items-center justify-center gap-2')}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export interface TabPanelProps {
  id: string;
  tabId: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, tabId, children, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${tabId}`}
      hidden={tabId !== id}
      className={clsx('mt-4', className)}
    >
      {children}
    </div>
  );
}