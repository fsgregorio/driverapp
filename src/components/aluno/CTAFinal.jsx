import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTAFinal = () => {
  const navigate = useNavigate();

  return (
    <section id="cta-final-section" className="py-20 md:py-32 bg-gradient-to-br from-primary to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Pronto para melhorar suas habilidades ao volante?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Encontre o instrutor ideal e comece suas aulas práticas hoje mesmo. Plataforma gratuita, instrutores certificados e total flexibilidade.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/waitlist')}
            className="bg-white text-primary font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Encontrar Instrutor
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('como-funciona-section');
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
            className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-primary"
          >
            Ver Como Funciona
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTAFinal;

