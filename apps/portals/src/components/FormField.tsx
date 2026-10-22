import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

export function FormField({
  name, label, type = 'text', required, value, onChange, error, options, placeholder, className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={name} className="text-sm font-medium text-surface-700">
        {label}{required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
      {type === 'select' && options ? (
        <select
          id={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        />
      )}
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}
