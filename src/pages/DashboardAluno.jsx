import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/dashboard/common/DashboardNavbar';
import HomeSection from '../components/dashboard/aluno/HomeSection';
import ClassControl from '../components/dashboard/aluno/ClassControl';
import InstructorControl from '../components/dashboard/aluno/InstructorControl';
import SettingsSection from '../components/dashboard/aluno/SettingsSection';
import ScheduleConfirmationModal from '../components/dashboard/aluno/ScheduleConfirmationModal';
import { studentsAPI } from '../services/api';
import { autoCancelExpiredClasses } from '../utils/classUtils';
import SEO from '../components/SEO';

const DashboardAluno = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticatedAs, setActiveUser } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [classes, setClasses] = useState([]);
  const [initialTab, setInitialTab] = useState('agendadas');
  const [initialInstructorTab, setInitialInstructorTab] = useState('search');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Ativar sessão de aluno se existir
  useEffect(() => {
    if (!loading && isAuthenticatedAs('student')) {
      setActiveUser('student');
    }
  }, [loading, isAuthenticatedAs, setActiveUser]);

  useEffect(() => {
    // Só redirecionar se realmente não tiver sessão de aluno
    if (!loading && !isAuthenticatedAs('student')) {
      console.log('Student session not found, redirecting to login');
      navigate('/login?type=student', { replace: true });
    }
  }, [loading, isAuthenticatedAs, navigate]);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      if (isAuthenticatedAs('student') && !loading) {
        try {
          console.log('🔄 Recarregando aulas no DashboardAluno...');
          const loadedClasses = await studentsAPI.getClasses();
          console.log(`✅ Aulas carregadas no DashboardAluno: ${loadedClasses.length}`);
          console.log('📋 Aulas por status:', {
            agendadas: loadedClasses.filter(c => c.status === 'agendada' || c.status === 'confirmada').length,
            pendentes_aceite: loadedClasses.filter(c => c.status === 'pendente_aceite').length,
            pendentes_pagamento: loadedClasses.filter(c => c.status === 'pendente_pagamento').length,
            concluidas: loadedClasses.filter(c => c.status === 'concluida').length,
            canceladas: loadedClasses.filter(c => c.status === 'cancelada').length,
            total: loadedClasses.length
          });
          setClasses(loadedClasses);
        } catch (error) {
          console.error('Error loading classes:', error);
        }
      }
    };
    loadClasses();
    
    // Recarregar quando a página ganha foco (para atualizar dados)
    const handleFocus = () => {
      console.log('👁️ Página ganhou foco, recarregando aulas...');
      loadClasses();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticatedAs, loading]);

  // Removido: não mostrar modal automaticamente no dashboard
  // O modal só deve aparecer após login com Google na primeira vez

  // Verificar e cancelar automaticamente aulas que não foram aceitas/pagas até 24h antes
  useEffect(() => {
    if (!isAuthenticatedAs('student') || loading) return;

    // Função para verificar e cancelar aulas
    const checkAndCancelExpiredClasses = () => {
      setClasses(prevClasses => {
        const updatedClasses = autoCancelExpiredClasses(prevClasses);
        // Verificar se houve mudanças
        const hasChanges = updatedClasses.some((updatedClass, index) => {
          const prevClass = prevClasses[index];
          return updatedClass.status !== prevClass.status || updatedClass.autoCanceled;
        });
        
        if (hasChanges) {
          // Mostrar notificação se houver aulas canceladas
          const canceledCount = updatedClasses.filter(c => c.autoCanceled && !prevClasses.find(p => p.id === c.id && p.autoCanceled)).length;
          if (canceledCount > 0) {
            console.log(`${canceledCount} aula(s) cancelada(s) automaticamente por não terem sido aceitas/pagas até 24h antes do horário marcado.`);
            // Aqui você pode adicionar uma notificação visual se desejar
          }
        }
        
        return updatedClasses;
      });
    };

    // Verificar imediatamente ao montar
    checkAndCancelExpiredClasses();

    // Verificar a cada 30 minutos
    const interval = setInterval(checkAndCancelExpiredClasses, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticatedAs, loading]);

  const handleScheduleFromInstructor = async (scheduleData) => {
    try {
      // Aguardar um pouco para garantir que as aulas foram criadas no banco
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload classes to get the newly scheduled ones
      const loadedClasses = await studentsAPI.getClasses();
      setClasses(loadedClasses);
      
      console.log('📋 Aulas após agendamento:', {
        total: loadedClasses.length,
        pendentes_aceite: loadedClasses.filter(c => c.status === 'pendente_aceite').length,
        agendadas: loadedClasses.filter(c => c.status === 'agendada' || c.status === 'confirmada').length,
      });
      
      // Navegar para a seção de aulas e mostrar pendentes de aceite
      setActiveSection('classes');
      setInitialTab('pendentes_aceite');
      
      // Mostrar modal de confirmação após um pequeno delay
      setTimeout(() => {
        setShowConfirmationModal(true);
      }, 300);
    } catch (error) {
      console.error('Error scheduling class:', error);
      alert('Erro ao agendar aula. Por favor, tente novamente.');
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Quando mudar para instrutores, definir tab padrão
    if (section === 'instructors' && activeSection !== 'instructors') {
      setInitialInstructorTab('search');
    }
  };

  const handleScheduleNewClass = () => {
    setActiveSection('instructors');
    setInitialInstructorTab('search');
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticatedAs('student')) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO
        title="Dashboard Aluno - iDrive"
        description="Gerencie suas aulas e encontre instrutores na iDrive"
      />
      
      <DashboardNavbar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onScheduleNewClass={handleScheduleNewClass}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'home' && (
          <HomeSection 
            classes={classes} 
            onNavigateToSection={(section, tab) => {
              setActiveSection(section);
              if (tab) {
                setInitialTab(tab);
              }
            }}
          />
        )}

        {activeSection === 'classes' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Aulas</h1>
            <ClassControl 
              instructors={[]} 
              initialTab={initialTab}
              classes={classes}
              onClassesChange={setClasses}
            />
          </div>
        )}

        {activeSection === 'instructors' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Instrutores</h1>
            <InstructorControl 
              onScheduleClass={handleScheduleFromInstructor}
              initialTab={initialInstructorTab}
            />
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Configurações</h1>
            <SettingsSection />
          </div>
        )}
      </main>
      
      {/* Modal de Confirmação */}
      <ScheduleConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
        }}
      />
    </div>
  );
};

export default DashboardAluno;
