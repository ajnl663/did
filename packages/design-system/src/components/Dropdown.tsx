'use client';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export interface DropdownProps {
  children: ReactNode;
  trigger?: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ children, trigger, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 224;
      const left = align === 'right'
        ? rect.right - menuWidth + window.scrollX
        : rect.left + window.scrollX;
      const top = rect.bottom + 8 + window.scrollY;
      setPosition({ top, left, width: menuWidth });
    }
  }, [open, align]);

  const handleTriggerClick = () => {
    if (trigger) {
      setOpen(prev => !prev);
    } else {
      setOpen(prev => !prev);
    }
  };

  const renderMenu = () => {
    if (typeof children === 'function') {
      return (children as (close: () => void) => ReactNode)(() => setOpen(false));
    }
    return children;
  };

  return (
    <div className={clsx('relative inline-block', className)} ref={triggerRef}>
      {trigger ? (
        <div onClick={handleTriggerClick}>{trigger}</div>
      ) : (
        <div onClick={handleTriggerClick}>{renderMenu()}</div>
      )}
      {open && createPortal(
        <div
          ref={contentRef}
          style={{ position: 'absolute', top: position.top, left: position.left, width: position.width, zIndex: 50 }}
          className="min-w-[160px] bg-white rounded-xl border border-surface-200 shadow-card-hover py-1.5 animate-scale-in origin-top-right"
          role="menu"
        >
          {trigger ? renderMenu() : null}
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

interface MenuItemComponent {
  (props: MenuItemProps): JSX.Element;
  Item: (props: MenuItemProps) => JSX.Element;
  Divider: (props: MenuDividerProps) => JSX.Element;
  Label: (props: MenuLabelProps) => JSX.Element;
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
        'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50',
        destructive && !disabled ? 'text-danger-600 hover:bg-danger-50' : 'text-surface-700',
        className
      )}
      role="menuitem"
      aria-disabled={disabled}
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="text-xs text-surface-400">{shortcut}</span>}
    </button>
  );
}

export interface MenuDividerProps {
  className?: string;
}

export function MenuDivider({ className }: MenuDividerProps) {
  return <hr className={clsx('my-1.5 border-surface-200', className)} role="separator" />;
}

export interface MenuLabelProps {
  children: ReactNode;
  className?: string;
}

export function MenuLabel({ children, className }: MenuLabelProps) {
  return <div className={clsx('px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wide', className)}>{children}</div>;
}

(Menu as MenuItemComponent).Item = MenuItem;
(Menu as MenuItemComponent).Divider = MenuDivider;
(Menu as MenuItemComponent).Label = MenuLabel;
