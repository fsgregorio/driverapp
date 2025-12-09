import React from 'react';

const PrecosInstrutor = () => {

  return (
    <section id="precos-section" className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Preços
          </h2>
          <p className="text-xl text-gray-600">
            Modelo de comissão transparente e justo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Uso da Plataforma */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
            <div className="text-center">
              <div className="mb-6">
                <span className="text-5xl md:text-6xl font-bold">R$ 0</span>
                <span className="text-xl text-blue-100 ml-2">/mês</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Uso da Plataforma
              </h3>
              <p className="text-lg text-blue-100 mb-6">
                Use nossa plataforma sem custos iniciais. Sem taxas de cadastro, sem mensalidade fixa.
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sem taxas de cadastro</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sem mensalidade fixa</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Acesso ilimitado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comissão */}
          <div className="bg-accent rounded-3xl p-8 md:p-10 shadow-xl">
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
                Modelo de Comissão
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Cobramos apenas uma pequena comissão sobre cada aula realizada. Quanto mais você ensina, mais você ganha. Modelo justo e transparente.
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-gray-700">Comissão apenas sobre aulas realizadas</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Valores transparentes</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Pagamento recorrente garantido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrecosInstrutor;

