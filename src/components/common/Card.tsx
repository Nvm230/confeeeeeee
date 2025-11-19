import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-4 ${onClick ? 'cursor-pointer hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

