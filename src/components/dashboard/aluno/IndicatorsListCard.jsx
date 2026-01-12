import React from 'react';

const IndicatorsListCard = ({ title, total, items, icon, color = 'blue', emptyMessage = 'Nenhum item' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-full ${iconBgClasses[color]}`}>
          {icon || (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
        </div>
      </div>
      
      <h3 className="text-sm font-semibold opacity-80 mb-3">{title}</h3>
      
      {total !== undefined && total !== null && (
        <div className="mb-4">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-sm opacity-70 ml-2">total</span>
        </div>
      )}

      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm py-2 border-b border-opacity-20 last:border-0">
              <div className="flex-1">
                <span className="block">{item.label || item}</span>
                {item.subtitle && (
                  <span className="text-xs opacity-70 block mt-0.5">{item.subtitle}</span>
                )}
              </div>
              {item.count !== undefined && (
                <span className="font-semibold ml-2">{item.count}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70 italic">{emptyMessage}</p>
      )}
    </div>
  );
};

export default IndicatorsListCard;
