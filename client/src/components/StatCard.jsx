import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', change }) => {
  const colorMap = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  const iconClass = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between border border-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {(subtitle || change) && (
          <div className="mt-2 flex items-center text-sm">
            {change && (
              <span className={`font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            <span className="text-gray-500 ml-2">{subtitle}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${iconClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
