/**
 * TubeSpark Design System - Input Components
 * Reusable input components following landing page visual identity
 */

import React from 'react';
import { cn } from '@/lib/design-system/components';
import { componentClasses } from '@/lib/design-system/components';

interface BaseInputProps {
  label?: string;
  error?: string;
  success?: string;
  className?: string;
}

interface InputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  className,
  ...props
}) => {
  const inputClass = cn(
    componentClasses.input.base,
    error && componentClasses.input.error,
    success && componentClasses.input.success,
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={inputClass}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-400">{success}</p>
      )}
    </div>
  );
};

interface TextareaProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  success,
  className,
  ...props
}) => {
  const textareaClass = cn(
    componentClasses.input.base,
    'min-h-[100px] resize-y',
    error && componentClasses.input.error,
    success && componentClasses.input.success,
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={textareaClass}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-400">{success}</p>
      )}
    </div>
  );
};

interface SelectProps extends BaseInputProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  success,
  options,
  className,
  ...props
}) => {
  const selectClass = cn(
    componentClasses.input.base,
    'cursor-pointer',
    error && componentClasses.input.error,
    success && componentClasses.input.success,
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        className={selectClass}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-700">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-400">{success}</p>
      )}
    </div>
  );
};

// Search input with icon
export const SearchInput: React.FC<{
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}> = ({ placeholder = "Buscar...", onSearch, className }) => {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(componentClasses.input.base, "pl-10")}
        placeholder={placeholder}
      />
    </form>
  );
};

// Form group for better organization
export const FormGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
};