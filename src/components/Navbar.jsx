import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackButtonClick, trackNavigation, trackingEvents } from '../utils/trackingUtils';

const Navbar = ({ onSwitchProfile, currentProfile, scrollToSection: externalScrollToSection, hideFAQ = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const page = currentProfile === 'student' ? 'landing_aluno' : currentProfile === 'instructor' ? 'landing_instrutor' : 'home';
    trackButtonClick(
      currentProfile === 'student' ? trackingEvents.LANDING_ALUNO_NAV_SECTION : trackingEvents.LANDING_INSTRUTOR_NAV_SECTION,
      sectionId,
      { page, section: 'navbar', target_section: sectionId }
    );
    
    if (externalScrollToSection) {
      externalScrollToSection(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    trackNavigation(trackingEvents.NAV_HOME_CLICK, currentProfile === 'student' ? '/aluno' : currentProfile === 'instructor' ? '/instrutor' : '/', {
      current_profile: currentProfile
    });
    
    if (currentProfile === 'student') {
      navigate('/aluno');
    } else if (currentProfile === 'instructor') {
      navigate('/instrutor');
    } else {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    const eventName = currentProfile === 'student' 
      ? trackingEvents.LANDING_ALUNO_LOGIN 
      : currentProfile === 'instructor' 
      ? trackingEvents.LANDING_INSTRUTOR_LOGIN 
      : trackingEvents.LANDING_ALUNO_LOGIN;
    
    trackButtonClick(eventName, 'Login', {
      page: currentProfile === 'student' ? 'landing_aluno' : currentProfile === 'instructor' ? 'landing_instrutor' : 'home',
      section: 'navbar'
    });

    // Redirecionar para página de login com o tipo apropriado
    const userType = currentProfile === 'instructor' ? 'instructor' : 'student';
    navigate(`/login?type=${userType}`);
    
    if (currentProfile === 'student') {
      navigate('/dashboard/aluno');
    } else if (currentProfile === 'instructor') {
      navigate('/dashboard/instrutor');
    } else {
      navigate('/dashboard/aluno');
    }
  };

  const handleSwitchProfileClick = () => {
    trackButtonClick(trackingEvents.NAV_PROFILE_SWITCH, 'Trocar Perfil', {
      current_profile: currentProfile,
      page: currentProfile === 'student' ? 'landing_aluno' : currentProfile === 'instructor' ? 'landing_instrutor' : 'home'
    });
    if (onSwitchProfile) {
      onSwitchProfile();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="text-primary">DriveTo</span>
              <span className="text-secondary">Pass</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {currentProfile === 'student' && (
              <>
                <button
                  onClick={() => scrollToSection('hero-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Início
                </button>
                <button
                  onClick={() => scrollToSection('vantagens-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Vantagens
                </button>
                <button
                  onClick={() => scrollToSection('como-funciona-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Como Funciona
                </button>
                <button
                  onClick={() => scrollToSection('precos-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Preços
                </button>
                <button
                  onClick={() => scrollToSection('cta-final-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Começar
                </button>
                {!hideFAQ && (
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                  >
                    FAQ
                  </button>
                )}
              </>
            )}
            {currentProfile === 'instructor' && (
              <>
                <button
                  onClick={() => scrollToSection('hero-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Início
                </button>
                <button
                  onClick={() => scrollToSection('vantagens-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Vantagens
                </button>
                <button
                  onClick={() => scrollToSection('como-funciona-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Como Funciona
                </button>
                <button
                  onClick={() => scrollToSection('precos-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Preços
                </button>
                <button
                  onClick={() => scrollToSection('cta-final-section')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Começar
                </button>
                {!hideFAQ && (
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                  >
                    FAQ
                  </button>
                )}
              </>
            )}
            {!currentProfile && (
              <>
                <button
                  onClick={() => navigate('/aluno')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Para Alunos
                </button>
                <button
                  onClick={() => navigate('/instrutor')}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Para Instrutores
                </button>
              </>
            )}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLoginClick}
                className="bg-white hover:bg-gray-100 text-secondary border-2 border-gray-300 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={handleSwitchProfileClick}
                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Trocar Perfil
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-gray-200 mt-2">
            {currentProfile === 'student' && (
              <>
                <button
                  onClick={() => scrollToSection('hero-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Início
                </button>
                <button
                  onClick={() => scrollToSection('vantagens-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Vantagens
                </button>
                <button
                  onClick={() => scrollToSection('como-funciona-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Como Funciona
                </button>
                <button
                  onClick={() => scrollToSection('precos-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Preços
                </button>
                <button
                  onClick={() => scrollToSection('cta-final-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Começar
                </button>
                {!hideFAQ && (
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                  >
                    FAQ
                  </button>
                )}
              </>
            )}
            {currentProfile === 'instructor' && (
              <>
                <button
                  onClick={() => scrollToSection('hero-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Início
                </button>
                <button
                  onClick={() => scrollToSection('vantagens-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Vantagens
                </button>
                <button
                  onClick={() => scrollToSection('como-funciona-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Como Funciona
                </button>
                <button
                  onClick={() => scrollToSection('precos-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Preços
                </button>
                <button
                  onClick={() => scrollToSection('cta-final-section')}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Começar
                </button>
                {!hideFAQ && (
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                  >
                    FAQ
                  </button>
                )}
              </>
            )}
            {!currentProfile && (
              <>
                <button
                  onClick={() => {
                    navigate('/aluno');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Para Alunos
                </button>
                <button
                  onClick={() => {
                    navigate('/instrutor');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Para Instrutores
                </button>
              </>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  handleLoginClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-white hover:bg-gray-100 text-secondary border-2 border-gray-300 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center"
              >
                Login
              </button>
              <button
                onClick={() => {
                  handleSwitchProfileClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center"
              >
                Trocar Perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


