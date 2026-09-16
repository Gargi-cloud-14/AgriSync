import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading data...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
      <div
        className={`${sizeMap[size]} border-emerald-700 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-xs font-medium text-stone-500 tracking-wide">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
