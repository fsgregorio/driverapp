import React, { useState } from 'react';

const EmBreve = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar o email na lista de espera
    console.log('Email cadastrado:', email);
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="em-breve-section" className="py-20 md:py-32 bg-gradient-to-br from-accent via-white to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-100 rounded-full px-4 py-2 mb-4">
              <span className="text-yellow-800 font-semibold text-sm uppercase">Em Breve</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Aulas para quem quer tirar carteira
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Estamos em fase final de regulamentação da lei pelo governo
            </p>
            <p className="text-gray-500">
              Seja o primeiro a saber quando lançarmos esta funcionalidade
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Entrar na Lista de Espera
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Cadastrado com sucesso!</span>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  Você será notificado assim que lançarmos esta funcionalidade.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">✓</div>
                <p className="text-gray-600 text-sm">Regulamentação em andamento</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">✓</div>
                <p className="text-gray-600 text-sm">Parcerias sendo estabelecidas</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">✓</div>
                <p className="text-gray-600 text-sm">Lançamento em breve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmBreve;

