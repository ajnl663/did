'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
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
  return (
    <thead className={clsx('bg-surface-50 border-b border-surface-200', className)}>
      {children}
    </thead>
  );
}

export interface TbodyProps {
  children: ReactNode;
  className?: string;
}

export function Tbody({ children, className }: TbodyProps) {
  return (
    <tbody className={clsx('divide-y divide-surface-100', className)}>
      {children}
    </tbody>
  );
}

export interface TrProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function Tr({ children, className, onClick, clickable }: TrProps) {
  return (
    <tr
      className={clsx(
        'transition-colors duration-100',
        (clickable || onClick) && 'cursor-pointer hover:bg-surface-50',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export interface ThProps {
  children: ReactNode;
  className?: string;
  scope?: 'col' | 'row';
}

export function Th({ children, className, scope = 'col' }: ThProps) {
  return (
    <th
      scope={scope}
      className={clsx(
        'px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider text-left whitespace-nowrap',
        className
      )}
    >
      {children}
    </th>
  );
}

export interface TdProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export function Td({ children, className, colSpan }: TdProps) {
  return (
    <td
      className={clsx('px-4 py-3.5 text-sm text-surface-800', className)}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}