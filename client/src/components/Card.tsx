import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  bordered = true,
  shadow = 'md',
}: CardProps) {
  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // Border style
  const borderStyle = bordered ? 'border border-gray-200' : '';

  // Hover style
  const hoverStyle = hoverable
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1'
    : '';

  // Clickable style
  const clickableStyle = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden
        ${shadowStyles[shadow]}
        ${borderStyle}
        ${hoverStyle}
        ${clickableStyle}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Card Header component
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function CardHeader({ children, className = '', bordered = true }: CardHeaderProps) {
  const borderStyle = bordered ? 'border-b border-gray-200' : '';

  return (
    <div className={`px-4 py-3 ${borderStyle} ${className}`}>
      {children}
    </div>
  );
}

// Card Body component
interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// Card Footer component
interface CardFooterProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function CardFooter({ children, className = '', bordered = true }: CardFooterProps) {
  const borderStyle = bordered ? 'border-t border-gray-200' : '';

  return (
    <div className={`px-4 py-3 ${borderStyle} ${className}`}>
      {children}
    </div>
  );
}

// Card Grid component for displaying cards in a grid layout
interface CardGridProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export function CardGrid({
  children,
  columns = 3,
  gap = 4,
  className = '',
}: CardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapSize = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={`grid ${gridCols[columns as keyof typeof gridCols]} ${gapSize[gap as keyof typeof gapSize]} ${className}`}
    >
      {children}
    </div>
  );
}