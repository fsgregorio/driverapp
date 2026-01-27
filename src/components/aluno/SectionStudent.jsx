import React from 'react';

const SectionStudent = () => {
  return (
    <section id="student-section" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Aprenda a dirigir com confiança
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre instrutores certificados, compare preços e agende suas aulas no melhor horário para você.
          </p>
        </div>

        {/* How it Works */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-secondary text-center mb-12">
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-accent rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-secondary mb-4 text-center">
                1. Escolha um Instrutor Certificado
              </h4>
              <p className="text-gray-600 text-center">
                Compare preços e avaliações. Todos os instrutores são verificados e seguem as diretrizes do Detran local.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-accent rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-secondary mb-4 text-center">
                2. Agende no Melhor Horário
              </h4>
              <p className="text-gray-600 text-center">
                Aulas individuais, flexíveis e sem burocracia. Escolha o horário que melhor se encaixa na sua rotina.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-accent rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-secondary mb-4 text-center">
                3. Dirija com Segurança e Confiança
              </h4>
              <p className="text-gray-600 text-center">
                Pagamento protegido e suporte da plataforma. Aprenda no seu ritmo, com total segurança.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-secondary text-center mb-12">
            Por que escolher nossa plataforma?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Preço Acessível</h4>
                <p className="text-gray-600">Compare preços e encontre a melhor opção para o seu orçamento.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Instrutores Avaliados</h4>
                <p className="text-gray-600">Todos os instrutores passam por verificação e têm avaliações de alunos anteriores.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Carros com Manutenção em Dia</h4>
                <p className="text-gray-600">Todos os veículos são verificados regularmente para garantir sua segurança.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Aulas Personalizadas</h4>
                <p className="text-gray-600">Para iniciantes, quem tem medo, ou precisa se preparar para o exame prático.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Suporte via WhatsApp</h4>
                <p className="text-gray-600">Atendimento rápido e humanizado sempre que você precisar.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary mb-2">Liberdade de Escolha</h4>
                <p className="text-gray-600">Escolha o instrutor e o horário que preferir.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold py-5 px-12 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Encontre um Instrutor Agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionStudent;


