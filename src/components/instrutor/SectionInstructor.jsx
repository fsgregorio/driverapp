import React from 'react';

const SectionInstructor = () => {
  return (
    <section id="instructor-section" className="py-20 md:py-32 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Transforme sua experiência em renda
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cadastre-se como instrutor independente e comece a receber alunos hoje mesmo.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-20 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-secondary mb-4">
              Transforme sua experiência em direção em uma fonte de renda estável.
            </h3>
            <p className="text-lg text-gray-600">
              Como instrutor independente, você pode cadastrar sua documentação, veículo, disponibilidade e valor da hora/aula. 
              Tenha controle total sobre sua agenda e seus ganhos.
            </p>
          </div>
        </div>

        {/* Steps to Start */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-secondary text-center mb-12">
            Como Começar
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">
                Cadastre-se e Envie sua Certificação
              </h4>
              <p className="text-gray-600">
                Envie sua documentação exigida pelo Detran. Nossa equipe valida tudo rapidamente.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">
                Configure Horários e Preços
              </h4>
              <p className="text-gray-600">
                Defina sua disponibilidade e o valor da sua hora/aula. Você tem total controle.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">
                Receba Solicitações de Alunos
              </h4>
              <p className="text-gray-600">
                Alunos encontram seu perfil, veem suas avaliações e agendam aulas diretamente.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                4
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">
                Receba Pagamentos de Forma Segura
              </h4>
              <p className="text-gray-600">
                Pagamentos são processados de forma segura e você recebe de forma recorrente.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-secondary text-center mb-12">
            Vantagens de ser Instrutor na Plataforma
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
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

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
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

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
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

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
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

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow md:col-span-2">
              <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Destaque no Marketplace com Boas Avaliações</h4>
                <p className="text-gray-600">Quanto melhor seu desempenho, mais visibilidade você ganha. Sistema de avaliações justo e transparente.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold py-5 px-12 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Cadastrar como Instrutor
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionInstructor;


