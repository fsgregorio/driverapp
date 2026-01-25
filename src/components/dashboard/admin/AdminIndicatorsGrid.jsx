import React from 'react';

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(value)) return 'R$ 0,00';
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `R$ ${Number(value).toFixed(2)}`;
  }
};

const IndicatorCard = ({ label, value, highlight = false, isCurrency = false, loading }) => {
  return (
    <div
      className={`rounded-xl sm:rounded-2xl border bg-white p-3 sm:p-4 md:p-5 shadow-sm ${
        highlight ? 'border-primary/30' : 'border-gray-200'
      }`}
    >
      <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-1.5 sm:mt-2 flex items-baseline gap-2">
        {loading ? (
          <div className="h-6 sm:h-7 w-20 sm:w-24 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <p className={`text-xl sm:text-2xl font-bold ${highlight ? 'text-primary' : 'text-gray-900'}`}>
            {isCurrency ? formatCurrency(value || 0) : value ?? '-'}
          </p>
        )}
      </div>
    </div>
  );
};

const AdminIndicatorsGrid = ({ indicators, loading }) => {
  const {
    totalStudents = 0,
    activeStudents = 0,
    totalInstructors = 0,
    activeInstructors = 0,
    totalPaid = 0,
  } = indicators || {};

  return (
    <section aria-label="Indicadores gerais">
      <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900">Indicadores gerais</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <IndicatorCard
          label="Qtd. de Alunos"
          value={totalStudents}
          loading={loading}
        />
        <IndicatorCard
          label="Qtd. de Alunos ativos"
          value={activeStudents}
          loading={loading}
        />
        <IndicatorCard
          label="Qtd. de Instrutores"
          value={totalInstructors}
          loading={loading}
        />
        <IndicatorCard
          label="Qtd. de Instrutores ativos"
          value={activeInstructors}
          loading={loading}
        />
        <IndicatorCard
          label="Valor total pago"
          value={totalPaid}
          isCurrency
          highlight
          loading={loading}
        />
      </div>
    </section>
  );
};

export default AdminIndicatorsGrid;

