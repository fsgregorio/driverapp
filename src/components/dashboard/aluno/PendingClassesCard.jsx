import React from 'react';

const PendingClassesCard = ({ title, count, icon, color, onClick, onViewAll, subtitle }) => {

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onViewAll) {
      onViewAll();
    }
  };

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const iconColorClasses = {
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  };

  // Texto padrão baseado no título
  const getDefaultSubtitle = () => {
    if (title === 'Aulas Agendadas') {
      return count === 0 
        ? 'Nenhuma aula agendada' 
        : count === 1 
          ? '1 aula agendada' 
          : `${count} aulas agendadas`;
    }
    return count === 0 
      ? 'Nenhuma aula pendente' 
      : count === 1 
        ? '1 aula pendente' 
        : `${count} aulas pendentes`;
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-5 border-2 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-full bg-white flex-shrink-0 ${iconColorClasses[color] || iconColorClasses.blue}`}>
            {icon ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                {icon}
              </div>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden pr-1.5">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base leading-tight" style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none', wordSpacing: 'normal' }}>
              {title}
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm opacity-80 mt-0.5 sm:mt-1 leading-tight" style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none', wordSpacing: 'normal' }}>
              {subtitle || getDefaultSubtitle()}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0 ml-1">
          {count > 0 && (
            <span className="bg-white text-gray-800 font-bold text-sm sm:text-base md:text-lg px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full whitespace-nowrap">
              {count}
            </span>
          )}
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ml-0.5 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PendingClassesCard;
