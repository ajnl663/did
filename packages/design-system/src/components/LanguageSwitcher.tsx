'use client';
import { useState } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { Icon } from './Icon';

export interface LanguageSwitcherProps {
  currentLanguage?: 'en' | 'hi' | 'mr';
  onChange?: (lang: 'en' | 'hi' | 'mr') => void;
  variant?: 'dropdown' | 'segmented' | 'buttons';
  className?: string;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
] as const;

export function LanguageSwitcher({
  currentLanguage = 'en',
  onChange,
  variant = 'dropdown',
  className,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);

  const current = languages.find(l => l.code === currentLanguage) || languages[0];

  if (variant === 'segmented') {
    return (
      <div className={clsx('flex rounded-xl bg-surface-100 p-1', className)} role="group" aria-label="Language selection">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => onChange?.(lang.code)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              currentLanguage === lang.code
                ? 'bg-white text-primary-600 shadow-card'
                : 'text-surface-600 hover:text-surface-900'
            )}
            aria-pressed={currentLanguage === lang.code}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={clsx('flex gap-2', className)} role="group" aria-label="Language selection">
        {languages.map(lang => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onChange?.(lang.code)}
            aria-pressed={currentLanguage === lang.code}
          >
            {lang.flag} {lang.nativeName}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('relative inline-block', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="gap-2"
      >
        <span>{current.flag}</span>
        <span>{current.nativeName}</span>
        <Icon name="chevron-down" size={16} />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed z-50 mt-2 w-40 rounded-xl bg-white border border-surface-200 shadow-card-hover p-1" role="listbox">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { onChange?.(lang.code); setOpen(false); }}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  currentLanguage === lang.code ? 'bg-primary-50 text-primary-600' : 'text-surface-700 hover:bg-surface-50'
                )}
                role="option"
                aria-selected={currentLanguage === lang.code}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {currentLanguage === lang.code && <Icon name="check" size={16} className="ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}