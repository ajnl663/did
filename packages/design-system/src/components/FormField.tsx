'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Input } from './Input';
import { Select } from './Select';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select';
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  required,
  error,
  helperText,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled,
  options,
  leftIcon,
  rightIcon,
  className,
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  const handleBlur = () => onBlur?.();

  if (type === 'select') {
    return (
      <Select
        name={name}
        label={label}
        required={required}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        options={options || []}
        className={className}
      />
    );
  }

  return (
    <Input
      id={name}
      name={name}
      type={type}
      required={required}
      label={label}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={className}
    />
  );
}