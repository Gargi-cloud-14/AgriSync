import React, { type ReactNode } from 'react';

export type BadgeVariant = 'emerald' | 'amber' | 'blue' | 'stone' | 'rose' | 'saffron';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'emerald',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    blue: 'bg-sky-50 text-sky-800 border border-sky-200/80',
    stone: 'bg-stone-100 text-stone-700 border border-stone-200',
    rose: 'bg-rose-50 text-rose-800 border border-rose-200/80',
    saffron: 'bg-orange-50 text-orange-800 border border-orange-200/80',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full whitespace-nowrap tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
