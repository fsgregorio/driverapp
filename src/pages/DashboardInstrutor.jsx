import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/dashboard/common/DashboardNavbar';
import RegisterForm from '../components/dashboard/instrutor/RegisterForm';
import GoogleAuthButton from '../components/dashboard/aluno/GoogleAuthButton';
import ClassControl from '../components/dashboard/instrutor/ClassControl';
import IndicatorsDashboard from '../components/dashboard/instrutor/IndicatorsDashboard';
import Finances from '../components/dashboard/instrutor/Finances';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const DashboardInstrutor = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('indicators');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowRegister(true);
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!loading && isAuthenticated && userType !== 'instructor') {
      navigate('/dashboard/aluno');
    }
  }, [loading, isAuthenticated, userType, navigate]);

  const handleAuthSuccess = () => {
    setShowRegister(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || showRegister) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent via-white to-accent">
        <SEO
          title="Dashboard Instrutor - DriveToPass"
          description="Acesse seu dashboard de instrutor na DriveToPass"
        />
        
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div 
                className="flex-shrink-0 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img 
                  src="/imgs/logo/drivetopass.png" 
                  alt="DriveToPass" 
                  className="h-28 md:h-32 w-auto"
                />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="max-w-3xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                  Torne-se um Instrutor!
                </h1>
                <p className="text-gray-600">
                  Faça login ou crie sua conta de instrutor
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <GoogleAuthButton onSuccess={handleAuthSuccess} userType="instructor" />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                  </div>
                </div>
              </div>

              <RegisterForm onSuccess={handleAuthSuccess} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO
        title="Dashboard Instrutor - DriveToPass"
        description="Gerencie suas aulas, indicadores e finanças na DriveToPass"
      />
      
      <DashboardNavbar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'classes' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Controle de Aulas</h1>
            <ClassControl />
          </div>
        )}

        {activeSection === 'indicators' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Indicadores</h1>
            <IndicatorsDashboard />
          </div>
        )}

        {activeSection === 'finances' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Finanças</h1>
            <Finances />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardInstrutor;
