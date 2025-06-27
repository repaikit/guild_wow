import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  // Variant styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };

  // Width style
  const widthStyle = isFullWidth ? 'w-full' : '';

  // Disabled style
  const isDisabled = disabled || isLoading;
  const disabledStyle = isDisabled
    ? 'opacity-60 cursor-not-allowed'
    : 'hover:shadow-md';

  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${disabledStyle}
        rounded font-medium transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        inline-flex items-center justify-center
        ${className}
      `}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" color="white" />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}