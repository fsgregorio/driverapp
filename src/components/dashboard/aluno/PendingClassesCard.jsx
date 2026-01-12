import React from 'react';
import { useNavigate } from 'react-router-dom';

const PendingClassesCard = ({ title, count, icon, color, onClick, onViewAll, subtitle }) => {
  const navigate = useNavigate();

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
      className={`bg-white rounded-xl shadow-md p-6 border-2 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-white ${iconColorClasses[color] || iconColorClasses.blue}`}>
            {icon || (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm opacity-80 mt-1">
              {subtitle || getDefaultSubtitle()}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {count > 0 && (
            <span className="bg-white text-gray-800 font-bold text-xl px-4 py-2 rounded-full">
              {count}
            </span>
          )}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PendingClassesCard;
