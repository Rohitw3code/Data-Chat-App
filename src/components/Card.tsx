import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`glass-card rounded-xl shadow-lg ${className}`}>
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
}