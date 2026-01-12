import React, { useState } from 'react';
import { mockIndicators } from '../../../utils/mockData';

const IndicatorsDashboard = () => {
  const [period, setPeriod] = useState('month'); // week, month, year
  const indicators = mockIndicators;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const IndicatorCard = ({ title, value, change, icon, formatValue = (v) => v }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-accent`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-sm font-semibold ${getChangeColor(change)}`}>
            {formatPercentage(change)}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex justify-end">
        <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'year'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ano
          </button>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IndicatorCard
          title="Total de Alunos"
          value={indicators.totalStudents}
          change={indicators.studentsChange}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />

        <IndicatorCard
          title="Aulas Agendadas"
          value={indicators.scheduledClasses}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <IndicatorCard
          title="Aulas Completas"
          value={indicators.completedClasses}
          change={indicators.completedClassesChange}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <IndicatorCard
          title="Receita Total"
          value={indicators.totalRevenue}
          change={indicators.revenueChange}
          formatValue={formatCurrency}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <IndicatorCard
          title="Avaliação Média"
          value={indicators.averageRating}
          change={indicators.ratingChange}
          formatValue={(v) => v.toFixed(1)}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />

        <IndicatorCard
          title="Aulas Pendentes"
          value={indicators.pendingClasses}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Simple Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Receita</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[65, 75, 60, 80, 70, 85, 90].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary rounded-t-lg transition-all hover:bg-blue-600"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">Sem {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndicatorsDashboard;
