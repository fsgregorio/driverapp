import React from 'react';

const ComoFuncionaInstrutor = () => {
  return (
    <section id="como-funciona-section" className="py-20 md:py-32 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Processo simples para começar a receber alunos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">1</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Cadastre-se e Envie sua Certificação
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Envie sua documentação exigida pelo Detran. Nossa equipe valida tudo rapidamente.
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
              Complete seu perfil com suas informações, experiência e disponibilidade. Quanto mais completo, mais alunos você atrai.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">3</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Configure Horários e Preços
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Defina sua disponibilidade e o valor da sua hora/aula. Você tem total controle.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">4</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Receba Solicitações de Alunos
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Alunos encontram seu perfil, veem suas avaliações e agendam aulas diretamente.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">5</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Receba Pagamentos de Forma Segura
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Pagamentos são processados de forma segura e você recebe de forma recorrente.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Cadastrar como Instrutor
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComoFuncionaInstrutor;

