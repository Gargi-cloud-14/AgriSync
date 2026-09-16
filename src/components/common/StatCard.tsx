import React, { type ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accent?: 'emerald' | 'amber' | 'blue' | 'stone';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  accent = 'emerald',
  className = '',
}) => {
  const accentStyles = {
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
    amber: 'text-amber-700 bg-amber-50 border-amber-200/60',
    blue: 'text-sky-700 bg-sky-50 border-sky-200/60',
    stone: 'text-stone-700 bg-stone-100 border-stone-200/60',
  };

  return (
    <Card padding="sm" className={`bg-white hover:border-stone-300 transition-all ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-heading">{value}</p>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl border ${accentStyles[accent]}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-600">
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-700' : 'text-stone-700'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span className="truncate">{subtext}</span>}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
