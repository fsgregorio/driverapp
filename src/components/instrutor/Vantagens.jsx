import React from 'react';

const VantagensInstrutor = () => {
  return (
    <section id="vantagens-section" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Vantagens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Por que escolher nossa plataforma como instrutor
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-secondary mb-2">Zero Mensalidade Inicial</h4>
              <p className="text-gray-600">Comece sem custos. Modelo de comissão justo e transparente.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-secondary mb-2">Mais Alunos Sem Depender de Autoescolas</h4>
              <p className="text-gray-600">Aumente sua base de alunos sem intermediários.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-secondary mb-2">Agenda Integrada e Fácil de Gerenciar</h4>
              <p className="text-gray-600">Controle total sobre sua disponibilidade e agendamentos.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-secondary mb-2">Suporte Dedicado</h4>
              <p className="text-gray-600">Equipe pronta para ajudar você a ter sucesso na plataforma.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-secondary mb-2">Destaque no Marketplace</h4>
              <p className="text-gray-600">Quanto melhor seu desempenho, mais visibilidade você ganha.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-secondary mb-2">Controle Total sobre Preços</h4>
              <p className="text-gray-600">Você define o valor da sua hora/aula e gerencia seus ganhos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VantagensInstrutor;

