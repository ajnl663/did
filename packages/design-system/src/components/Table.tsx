'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface TableProps {
  children: ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export function Table({ children, className, striped, hoverable, compact }: TableProps) {
  return (
    <div className={clsx('w-full overflow-x-auto', className)}>
      <table className="w-full text-left">
        {children}
      </table>
    </div>
  );
}

export interface TheadProps {
  children: ReactNode;
  className?: string;
}

export function Thead({ children, className }: TheadProps) {
  return <thead className={clsx('bg-surface-50', className)}>{children}</thead>;
}

export interface TbodyProps {
  children: ReactNode;
  className?: string;
}

export function Tbody({ children, className }: TbodyProps) {
  return <tbody className={clsx('divide-y divide-surface-200', className)}>{children}</tbody>;
}

export interface TrProps {
  children: ReactNode;
  className?: string;
}

export function Tr({ children, className }: TrProps) {
  return <tr className={clsx(className)}>{children}</tr>;
}

export interface ThProps {
  children: ReactNode;
  className?: string;
  scope?: 'col' | 'row';
}

export function Th({ children, className, scope = 'col' }: ThProps) {
  return (
    <th scope={scope} className={clsx('px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

export interface TdProps {
  children: ReactNode;
  className?: string;
}

export function Td({ children, className }: TdProps) {
  return <td className={clsx('px-4 py-3 text-sm text-surface-900', className)}>{children}</td>;
}