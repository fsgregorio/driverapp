import React from 'react';

const steps = [
  { key: 'clickedStartNow', label: 'Clicou em Começar agora' },
  { key: 'createdAccount', label: 'Criou conta' },
  { key: 'clickedSchedule', label: 'Clicou para agendar aula' },
  { key: 'scheduledClass', label: 'Agendou aula' },
  { key: 'clickedPay', label: 'Clicou em pagar' },
  { key: 'clickedCoupon', label: 'Clicou em Quero meu cupom' },
];

const AdminFunnel = ({ metrics, loading }) => {
  const data = metrics || {};
  const maxValue =
    Object.values(data).length > 0 ? Math.max(...Object.values(data).map((v) => v || 0)) : 0;

  return (
    <section aria-label="Funil de conversão">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Funil de conversão</h2>
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        {steps.map((step) => {
          const value = data[step.key] || 0;
          const widthPercent = maxValue > 0 ? Math.max((value / maxValue) * 100, 8) : 0;

          return (
            <div key={step.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                <span>{step.label}</span>
                {loading ? (
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  <span className="font-semibold text-gray-900">{value}</span>
                )}
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{
                    width: loading || maxValue === 0 ? '0%' : `${widthPercent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AdminFunnel;

