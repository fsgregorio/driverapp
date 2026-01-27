import React from 'react';

const steps = [
  { key: 'clickedStartNow', label: 'Clicou em Começar agora' },
  { key: 'createdAccount', label: 'Criou conta' },
  { key: 'completedProfile', label: 'Criou Perfil' },
  { key: 'scheduledClass', label: 'Agendou Aula' },
  { key: 'initiatedPayment', label: 'Iniciou Pagamento' },
  { key: 'requestedCoupon', label: 'Requisitou Cupom' },
];

const AdminFunnel = ({ metrics, loading }) => {
  const data = metrics || {};
  const maxValue =
    Object.values(data).length > 0 ? Math.max(...Object.values(data).map((v) => v || 0)) : 0;

  // Calcular larguras relativas para o formato de funil
  // Cada etapa deve ser proporcional ao valor, mas também criar efeito visual de funil
  const getFunnelWidth = (value, index, totalSteps) => {
    if (maxValue === 0 || value === 0) return 0;
    
    // Calcular largura baseada na proporção do valor em relação ao máximo
    // E aplicar um fator de redução progressiva para criar efeito de funil
    const valueRatio = value / maxValue;
    // Redução progressiva: primeira etapa 100%, última etapa ~25% da largura base
    const funnelFactor = 1 - (index / (totalSteps - 1)) * 0.75;
    const baseWidth = valueRatio * 100;
    
    // Largura mínima para garantir visibilidade
    const minWidth = value > 0 ? 20 : 0;
    
    return Math.max(baseWidth * funnelFactor, minWidth);
  };
  
  // Calcular taxa de conversão entre etapas
  const getConversionRate = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) return null;
    return ((currentValue / previousValue) * 100).toFixed(1);
  };

  return (
    <section aria-label="Funil de conversão">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Funil de conversão</h2>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        {/* Container responsivo com largura máxima para o funil */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col space-y-0">
            {steps.map((step, index) => {
              const value = data[step.key] || 0;
              const previousValue = index > 0 ? (data[steps[index - 1].key] || 0) : null;
              const widthPercent = loading || maxValue === 0 ? 0 : getFunnelWidth(value, index, steps.length);
              const conversionRate = getConversionRate(value, previousValue);

              return (
                <div key={step.key} className="w-full">
                  {/* Linha responsiva: Label | Barra | Números */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 relative" style={{ minHeight: '40px' }}>
                    {/* Label à esquerda - responsivo */}
                    <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[140px] md:min-w-[180px]">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">{step.label}</span>
                    </div>
                    
                    {/* Container da barra do funil - responsivo */}
                    <div className="flex-1 w-full sm:w-auto flex justify-start sm:justify-center items-center relative" style={{ minHeight: '40px', marginBottom: index < steps.length - 1 ? '8px' : '0' }}>
                      {widthPercent > 0 ? (
                        <div className="relative w-full flex justify-start sm:justify-center">
                          {/* Barra principal do funil */}
                          <div
                            className="bg-primary transition-all duration-500 ease-out relative"
                            style={{
                              width: `clamp(60px, ${widthPercent}%, 100%)`,
                              height: '40px',
                              minHeight: '36px',
                              borderRadius: '8px',
                            }}
                          >
                            {/* Gradiente sutil para profundidade */}
                            <div 
                              className="absolute inset-0 opacity-8 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-lg"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Placeholder quando não há valor */
                        <div className="h-10 w-full sm:w-48 border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">0</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Percentual e número à direita - responsivo */}
                    <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[80px] md:min-w-[100px] justify-start sm:justify-end">
                      {conversionRate !== null && value > 0 && (
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {conversionRate}%
                        </span>
                      )}
                      {loading ? (
                        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                      ) : (
                        <span className="font-bold text-gray-900 text-sm sm:text-base">{value}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminFunnel;

