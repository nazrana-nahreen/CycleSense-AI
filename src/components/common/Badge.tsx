import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rose' | 'lavender' | 'peach' | 'sage' | 'amber' | 'plum' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'rose',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    lavender: 'bg-lavender-50 text-lavender-800 border border-lavender-200/60',
    peach: 'bg-peach-100 text-peach-700 border border-peach-300/60',
    sage: 'bg-sage-50 text-sage-600 border border-sage-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    plum: 'bg-plum-50 text-plum-800 border border-plum-200',
    outline: 'bg-white/80 text-plum-700 border border-plum-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-medium',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
