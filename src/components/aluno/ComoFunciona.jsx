import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComoFunciona = () => {
  const navigate = useNavigate();

  return (
    <section id="como-funciona-section" className="py-20 md:py-32 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Processo simples e rápido para tirar sua carteira de motorista
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">1</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Crie sua Conta
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Cadastre-se gratuitamente na plataforma. É rápido, simples e sem burocracia.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">2</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Encontre seu Instrutor
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Navegue pela lista de instrutores profissionais certificados, veja avaliações, preços e escolha o melhor para você.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">3</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Agende suas Aulas
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Selecione os dias e horários que preferir. Nossa plataforma oferece total flexibilidade para se adequar à sua rotina.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">4</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Aprenda e Pratique
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Aprenda a dirigir com segurança e confiança. Seu instrutor profissional te guiará em cada etapa até você estar pronto para o exame.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-xl md:text-2xl font-bold">5</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-secondary mb-4 text-center">
              Tire sua Carteira
            </h4>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Após concluir suas aulas práticas, você estará preparado para fazer o exame do Detran e tirar sua primeira habilitação.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => {
              navigate('/register?type=student');
            }}
            className="bg-primary hover:bg-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            Começar Agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;

