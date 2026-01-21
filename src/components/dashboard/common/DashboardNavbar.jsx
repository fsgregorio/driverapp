import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { trackButtonClick, trackNavigation, trackingEvents } from '../../../utils/trackingUtils';

const DashboardNavbar = ({ activeSection, onSectionChange, onScheduleNewClass }) => {
  const navigate = useNavigate();
  const { user, logout, userType } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Bloquear scroll do body quando menu mobile estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = async (e) => {
    // Prevenir comportamento padrão se for um evento
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Fechar menu mobile se estiver aberto
    setIsMenuOpen(false);
    
    // Salvar o tipo de usuário antes do logout (pois será limpo)
    const currentUserType = userType;
    
    const eventName = currentUserType === 'student' 
      ? trackingEvents.DASHBOARD_ALUNO_LOGOUT 
      : trackingEvents.DASHBOARD_INSTRUTOR_LOGOUT;
    
    trackButtonClick(eventName, 'Sair', {
      user_type: currentUserType,
      page: `dashboard_${currentUserType}`
    });
    
    try {
      // Fazer logout
      await logout();
      
      // Aguardar um pouco para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Redirecionar para tela de login com o tipo de usuário
      const loginType = currentUserType === 'student' ? 'student' : 'instructor';
      navigate(`/login?type=${loginType}`, { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, redireciona para a tela de login
      const loginType = currentUserType === 'student' ? 'student' : 'instructor';
      navigate(`/login?type=${loginType}`, { replace: true });
    }
  };

  const handleSectionChange = (sectionId) => {
    const eventName = userType === 'student' 
      ? trackingEvents.DASHBOARD_ALUNO_SECTION_CHANGE 
      : trackingEvents.DASHBOARD_INSTRUTOR_SECTION_CHANGE;
    
    trackButtonClick(eventName, sectionId, {
      user_type: userType,
      page: `dashboard_${userType}`,
      section: 'navbar',
      target_section: sectionId,
      previous_section: activeSection
    });
    
    setIsMenuOpen(false); // Fechar menu mobile ao mudar de seção
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const handleScheduleNewClassClick = () => {
    trackButtonClick(trackingEvents.DASHBOARD_ALUNO_SCHEDULE_NEW_CLASS, '+ Agendar Nova Aula', {
      user_type: userType,
      page: 'dashboard_aluno',
      section: 'navbar'
    });
    
    if (onScheduleNewClass) {
      onScheduleNewClass();
    } else {
      handleSectionChange('instructors');
    }
  };

  const handleLogoClick = () => {
    trackNavigation(trackingEvents.NAV_HOME_CLICK, '/', {
      user_type: userType,
      from: `dashboard_${userType}`
    });
    navigate('/');
  };

  const sections = userType === 'student' 
    ? [
        { id: 'home', label: 'Início' },
        { id: 'classes', label: 'Aulas' },
        { id: 'instructors', label: 'Instrutores' },
        { id: 'settings', label: 'Configurações' }
      ]
    : [
        { id: 'classes', label: 'Aulas' },
        { id: 'indicators', label: 'Indicadores' },
        { id: 'finances', label: 'Finanças' }
      ];

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Lado Esquerdo - Logo (Desktop) */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <div 
                className="cursor-pointer"
                onClick={handleLogoClick}
              >
                <img 
                  src="/imgs/logo/iDrive.png" 
                  alt="iDrive Logo" 
                  className="h-11 w-auto"
                />
              </div>
            </div>

            {/* Logo - Centralizado (Mobile) */}
            <div 
              className="lg:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={handleLogoClick}
            >
              <img 
                src="/imgs/logo/iDrive.png" 
                alt="iDrive Logo" 
                className="h-9 sm:h-11 md:h-12 w-auto"
              />
            </div>

            {/* Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 ml-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Lado Direito - User Menu (Desktop) ou Mobile Menu Button */}
            <div className="flex items-center lg:flex-shrink-0 justify-end">
              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* Botão Agendar Nova Aula - apenas para estudantes */}
                {userType === 'student' && (
                  <button
                    onClick={handleScheduleNewClassClick}
                    className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    + Agendar Nova Aula
                  </button>
                )}
                {/* User Info com Foto e Nome */}
                <div className="hidden xl:flex items-center space-x-3">
                  <img
                    src={user?.photo || '/imgs/users/image.png'}
                    alt={user?.name || 'Usuário'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = '/imgs/users/image.png';
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={(e) => handleLogout(e)}
                  className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                >
                  Sair
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-700 z-20 relative"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
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
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              {/* Header com Logo e Botão Fechar */}
              <div className="flex items-center justify-between mb-8">
                <div 
                  className="cursor-pointer"
                  onClick={handleLogoClick}
                >
                  <img 
                    src="/imgs/logo/iDrive.png" 
                    alt="iDrive Logo" 
                    className="h-9 w-auto"
                  />
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-primary p-2"
                  aria-label="Fechar menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Botão Agendar Nova Aula - apenas para estudantes */}
              {userType === 'student' && (
                <button
                  onClick={() => {
                    handleScheduleNewClassClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-center mb-6"
                >
                  + Agendar Nova Aula
                </button>
              )}

              {/* Navigation Links Mobile */}
              <div className="space-y-2 mb-6">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {/* User Info e Logout */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3 px-4 py-3 mb-4">
                  <img
                    src={user?.photo || '/imgs/users/image.png'}
                    alt={user?.name || 'Usuário'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = '/imgs/users/image.png';
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={(e) => handleLogout(e)}
                  className="w-full text-left px-4 py-3 text-gray-600 hover:text-primary transition-colors text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardNavbar;
