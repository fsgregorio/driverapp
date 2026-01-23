import React from 'react';

const Vantagens = () => {
  return (
    <section id="vantagens-section" className="py-20 md:py-32 bg-white" aria-labelledby="vantagens-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="vantagens-heading" className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Vantagens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Por que escolher nossa plataforma para tirar sua carteira de motorista
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          <article className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow" role="listitem">
            <div className="bg-green-100 rounded-full p-3 flex-shrink-0" aria-hidden="true">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary mb-2">100% Gratuito</h3>
              <p className="text-gray-600">A plataforma é totalmente gratuita. Sem taxas de cadastro ou mensalidade.</p>
            </div>
          </article>

          <article className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow" role="listitem">
            <div className="bg-blue-100 rounded-full p-3 flex-shrink-0" aria-hidden="true">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary mb-2">Instrutores Certificados</h3>
              <p className="text-gray-600">Todos os instrutores são verificados e certificados pelo Detran.</p>
            </div>
          </article>

          <article className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow" role="listitem">
            <div className="bg-purple-100 rounded-full p-3 flex-shrink-0" aria-hidden="true">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary mb-2">Instrutores Profissionais</h3>
              <p className="text-gray-600">Conectamos você com instrutores certificados e experientes para garantir seu aprendizado.</p>
            </div>
          </article>

          <article className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow" role="listitem">
            <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0" aria-hidden="true">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary mb-2">Horários Flexíveis</h3>
              <p className="text-gray-600">Escolha o horário que melhor se encaixa na sua rotina.</p>
            </div>
          </article>

          <article className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow" role="listitem">
            <div className="bg-green-100 rounded-full p-3 flex-shrink-0" aria-hidden="true">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary mb-2">Acompanhamento Completo</h3>
              <p className="text-gray-600">Acompanhamento desde o início até você estar pronto para o exame do Detran.</p>
            </div>
          </article>

          <article className="flex items-start gap-4 p-6 bg-accent rounded-2xl hover:shadow-lg transition-shadow" role="listitem">
            <div className="bg-red-100 rounded-full p-3 flex-shrink-0" aria-hidden="true">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary mb-2">Suporte Dedicado</h3>
              <p className="text-gray-600">Atendimento rápido via WhatsApp sempre que precisar.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Vantagens;

