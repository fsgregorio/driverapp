import React from 'react';
import { useNavigate } from 'react-router-dom';
import { trackButtonClick, trackingEvents } from '../../utils/trackingUtils';

const HeroInstrutor = () => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    trackButtonClick(trackingEvents.LANDING_INSTRUTOR_CTA_HERO, 'Cadastrar como Instrutor', {
      page: 'landing_instrutor',
      section: 'hero'
    });
    navigate('/dashboard/instrutor');
  };

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-white to-accent overflow-hidden pt-16" aria-label="Hero section">
      {/* Background Illustration */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* City map silhouette */}
          <path d="M100 700 L150 650 L200 680 L250 600 L300 650 L350 580 L400 620 L450 550 L500 600 L550 520 L600 580 L650 500 L700 550 L750 480 L800 520 L850 450 L900 500 L950 420 L1000 480 L1050 400 L1100 450 L1150 380 L1200 420 L1200 800 L100 800 Z" fill="#2463EB"/>
          {/* Car silhouette */}
          <ellipse cx="600" cy="400" rx="200" ry="100" fill="#2463EB"/>
          <rect x="450" y="350" width="300" height="100" rx="20" fill="#2463EB"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6 animate-fadeIn">
              Transforme sua experiência em uma fonte de renda estável
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto md:mx-0 animate-fadeIn delay-200">
              Cadastre-se como instrutor independente e comece a receber alunos hoje mesmo. Controle total sobre sua agenda e seus ganhos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fadeIn delay-400">
              <button
                onClick={handleCTAClick}
                className="bg-primary hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Cadastrar como Instrutor
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fadeIn delay-300">
            <div className="relative z-10">
              <img 
                src="/imgs/instrutor.png" 
                alt="Instrutor de direção certificado oferecendo aulas práticas na plataforma iDrive" 
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                loading="eager"
                width="600"
                height="400"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroInstrutor;

