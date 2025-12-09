import React from 'react';

const ComoFunciona = () => {
  return (
    <section id="como-funciona-section" className="py-20 md:py-32 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Processo simples e rápido para começar suas aulas práticas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">1</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Selecione o Tipo de Aula
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Escolha entre baliza, controle de embreagem, rodovia, estacionamento e outros tipos de aula.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">2</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Preencha seu Perfil
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Complete seu cadastro com suas informações básicas. É rápido e simples.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">3</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Escolha seu Instrutor
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Navegue pela lista de instrutores certificados, veja avaliações e escolha o que melhor se adequa a você.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">4</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Agende sua Aula
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Selecione o dia e horário que preferir. Nossa plataforma é totalmente flexível e sem burocracia.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">5</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Pratique e Melhore
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Pratique suas habilidades ao volante com segurança e confiança. Melhore sua técnica a cada aula.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Encontre um Instrutor Agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;

