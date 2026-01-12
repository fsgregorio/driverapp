import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/dashboard/common/DashboardNavbar';
import ClassControl from '../components/dashboard/instrutor/ClassControl';
import IndicatorsDashboard from '../components/dashboard/instrutor/IndicatorsDashboard';
import Finances from '../components/dashboard/instrutor/Finances';
import SEO from '../components/SEO';

const DashboardInstrutor = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('indicators');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login?type=instructor');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated && userType !== 'instructor') {
      navigate('/dashboard/aluno');
    }
  }, [loading, isAuthenticated, userType, navigate]);

  // Removido: não mostrar modal automaticamente no dashboard
  // O modal só deve aparecer após login com Google na primeira vez

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
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
