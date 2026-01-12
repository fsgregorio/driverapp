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
    <div className={`bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-full ${iconBgClasses[color]}`}>
          {icon ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              {icon}
            </div>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
        </div>
      </div>
      
      <h3 className="text-xs sm:text-sm font-semibold opacity-80 mb-3">{title}</h3>
      
      {total !== undefined && total !== null && (
        <div className="mb-3 sm:mb-4">
          <span className="text-2xl sm:text-3xl font-bold">{total}</span>
          <span className="text-xs sm:text-sm opacity-70 ml-2">total</span>
        </div>
      )}

      {items && items.length > 0 ? (
        <ul className="space-y-1.5 sm:space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-xs sm:text-sm py-1.5 sm:py-2 border-b border-opacity-20 last:border-0">
              <div className="flex-1 min-w-0 pr-2">
                <span className="block truncate">{item.label || item}</span>
                {item.subtitle && (
                  <span className="text-xs opacity-70 block mt-0.5 truncate">{item.subtitle}</span>
                )}
              </div>
              {item.count !== undefined && (
                <span className="font-semibold ml-2 flex-shrink-0">{item.count}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs sm:text-sm opacity-70 italic">{emptyMessage}</p>
      )}
    </div>
  );
};

export default IndicatorsListCard;
