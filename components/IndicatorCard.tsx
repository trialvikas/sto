
import React from 'react';

interface IndicatorCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg flex items-center space-x-4">
      <div className="flex-shrink-0 bg-gray-700/50 rounded-full p-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-brand-text-secondary">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-brand-text-secondary">{subtitle}</p>}
      </div>
    </div>
  );
};
