'use client';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export interface DropdownProps {
  children: ReactNode;
  trigger: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ children, trigger, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('relative inline-block', className)} ref={triggerRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && createPortal(
        <div
          ref={contentRef}
          className={clsx(
            'fixed z-50 mt-2 min-w-[160px] bg-white rounded-xl border border-surface-200 shadow-card-hover py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
}

export interface MenuProps {
  children: ReactNode;
  className?: string;
}

export function Menu({ children, className }: MenuProps) {
  return <div className={clsx(className)}>{children}</div>;
}

export interface MenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  shortcut?: string;
  destructive?: boolean;
}

export function MenuItem({ children, onSelect, disabled, className, icon, shortcut, destructive }: MenuItemProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50',
        destructive && !disabled ? 'text-danger-600 hover:bg-danger-50' : 'text-surface-700',
        className
      )}
      role="menuitem"
      aria-disabled={disabled}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {shortcut && <span className="text-xs text-surface-400">{shortcut}</span>}
    </button>
  );
}

export interface MenuDividerProps {
  className?: string;
}

export function MenuDivider({ className }: MenuDividerProps) {
  return <hr className={clsx('my-1 border-surface-200', className)} role="separator" />;
}