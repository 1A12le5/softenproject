import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ className, children, onClick, hover = false }) => {
  return (
    <div
      className={twMerge(
        'card animate-enter',
        hover ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-1' : '',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
  return (
    <div className={twMerge('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({ className, children }) => {
  return <div className={twMerge('px-6 py-4', className)}>{children}</div>;
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => {
  return (
    <div className={twMerge('px-6 py-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };