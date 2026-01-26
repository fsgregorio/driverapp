import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/dashboard/common/DashboardNavbar';
import ClassControl from '../components/dashboard/instrutor/ClassControl';
import IndicatorsDashboard from '../components/dashboard/instrutor/IndicatorsDashboard';
import Finances from '../components/dashboard/instrutor/Finances';
import SEO from '../components/SEO';

const DashboardInstrutor = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, isAuthenticatedAs, setActiveUser } = useAuth();
  const [activeSection, setActiveSection] = useState('indicators');

  // Inicializar seção a partir do hash da URL se existir
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['classes', 'indicators', 'finances'].includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  // Ativar sessão de instrutor se existir
  useEffect(() => {
    if (!loading && isAuthenticatedAs('instructor')) {
      setActiveUser('instructor');
    }
  }, [loading, isAuthenticatedAs, setActiveUser]);

  // Usar useRef para evitar múltiplos redirecionamentos
  const hasRedirectedRef = useRef(false);
  
  useEffect(() => {
    // Resetar flag quando a sessão for restaurada
    if (isAuthenticatedAs('instructor')) {
      hasRedirectedRef.current = false;
      return;
    }
    
    // Só redirecionar uma vez se realmente não tiver sessão de instrutor
    if (!loading && !isAuthenticatedAs('instructor') && !hasRedirectedRef.current) {
      const currentPath = window.location.pathname;
      // Só redirecionar se não estiver já na página de login e não tiver redirecionado antes
      if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
        hasRedirectedRef.current = true;
        navigate('/login?type=instructor');
      }
    }
  }, [loading, isAuthenticatedAs, navigate]);

  // Sincronizar seção com o histórico do navegador
  useEffect(() => {
    // Criar entrada inicial no histórico se não houver
    const currentHash = window.location.hash.replace('#', '');
    const validSections = ['classes', 'indicators', 'finances'];
    const initialSection = currentHash && validSections.includes(currentHash) 
      ? currentHash 
      : 'indicators';
    if (!currentHash || !validSections.includes(currentHash)) {
      window.history.replaceState({ section: initialSection }, '', `#${initialSection}`);
    }

    // Listener para o botão voltar do navegador
    const handlePopState = (event) => {
      if (event.state && event.state.section) {
        setActiveSection(event.state.section);
      } else {
        // Se não houver state, verificar hash
        const hash = window.location.hash.replace('#', '');
        if (hash && ['classes', 'indicators', 'finances'].includes(hash)) {
          setActiveSection(hash);
        } else {
          // Se não houver hash válido, voltar para indicators
          setActiveSection('indicators');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Executar apenas uma vez na montagem

  const handleSectionChange = (section) => {
    // Criar nova entrada no histórico quando mudar de seção
    window.history.pushState({ section }, '', `#${section}`);
    setActiveSection(section);
  };

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
        title="Dashboard Instrutor - iDrive"
        description="Gerencie suas aulas, indicadores e finanças na iDrive"
      />
      
      <DashboardNavbar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeSection === 'classes' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Controle de Aulas</h1>
            <ClassControl />
          </div>
        )}

        {activeSection === 'indicators' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Indicadores</h1>
            <IndicatorsDashboard />
          </div>
        )}

        {activeSection === 'finances' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Finanças</h1>
            <Finances />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardInstrutor;
