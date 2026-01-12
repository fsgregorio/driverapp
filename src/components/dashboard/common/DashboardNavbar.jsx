import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { trackButtonClick, trackNavigation, trackingEvents } from '../../../utils/trackingUtils';

const DashboardNavbar = ({ activeSection, onSectionChange, onScheduleNewClass }) => {
  const navigate = useNavigate();
  const { user, logout, userType } = useAuth();

  const handleLogout = () => {
    const eventName = userType === 'student' 
      ? trackingEvents.DASHBOARD_ALUNO_LOGOUT 
      : trackingEvents.DASHBOARD_INSTRUTOR_LOGOUT;
    
    trackButtonClick(eventName, 'Sair', {
      user_type: userType,
      page: `dashboard_${userType}`
    });
    
    logout();
    navigate('/');
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
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img 
              src="/imgs/logo/drivetopass.png" 
              alt="DriveToPass" 
              className="h-28 md:h-32 w-auto"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 relative">
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

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Botão Agendar Nova Aula - apenas para estudantes */}
            {userType === 'student' && (
              <button
                onClick={handleScheduleNewClassClick}
                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                + Agendar Nova Aula
              </button>
            )}
            <div className="flex items-center space-x-3">
              {user?.photo && (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
            >
              Sair
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => {
              // Toggle mobile menu if needed
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
