import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = false,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Size styles
    const sizeStyles = {
      sm: 'py-1 px-2 text-sm',
      md: 'py-2 px-3 text-base',
      lg: 'py-3 px-4 text-lg',
    };

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Error styles
    const hasError = !!error;
    const inputErrorStyle = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    // Icon padding
    const leftPadding = leftIcon ? 'pl-10' : '';
    const rightPadding = rightIcon ? 'pr-10' : '';

    return (
      <div className={`${widthStyle} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              ${sizeStyles[size]}
              ${leftPadding}
              ${rightPadding}
              ${inputErrorStyle}
              ${widthStyle}
              rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            {...rest}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

// TextArea component
interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  rows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      className = '',
      id,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    // Size styles
    const sizeStyles = {
      sm: 'py-1 px-2 text-sm',
      md: 'py-2 px-3 text-base',
      lg: 'py-3 px-4 text-lg',
    };

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Error styles
    const hasError = !!error;
    const textareaErrorStyle = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    return (
      <div className={`${widthStyle} ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            ${sizeStyles[size]}
            ${textareaErrorStyle}
            ${widthStyle}
            rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${textareaId}-error` : undefined}
          {...rest}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${textareaId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';