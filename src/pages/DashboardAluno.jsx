import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/dashboard/common/DashboardNavbar';
import HomeSection from '../components/dashboard/aluno/HomeSection';
import ClassControl from '../components/dashboard/aluno/ClassControl';
import InstructorControl from '../components/dashboard/aluno/InstructorControl';
import SettingsSection from '../components/dashboard/aluno/SettingsSection';
import { mockInstructors, mockStudentClasses } from '../utils/mockData';
import { autoCancelExpiredClasses } from '../utils/classUtils';
import SEO from '../components/SEO';

const DashboardAluno = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [classes, setClasses] = useState(mockStudentClasses);
  const [initialTab, setInitialTab] = useState('agendadas');
  const [initialInstructorTab, setInitialInstructorTab] = useState('search');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login?type=student');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated && userType !== 'student') {
      navigate('/dashboard/instrutor');
    }
  }, [loading, isAuthenticated, userType, navigate]);

  // Removido: não mostrar modal automaticamente no dashboard
  // O modal só deve aparecer após login com Google na primeira vez

  // Verificar e cancelar automaticamente aulas que não foram aceitas/pagas até 24h antes
  useEffect(() => {
    if (!isAuthenticated || loading) return;

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
  }, [isAuthenticated, loading]);

  const handleScheduleFromInstructor = (scheduleData) => {
    // Criar nova aula pendente de aceite
    const newClass = {
      id: Date.now(),
      instructorId: scheduleData.instructorId,
      instructorName: scheduleData.instructor.name,
      instructorPhoto: scheduleData.instructor.photo,
      date: scheduleData.dates[0]?.date || null, // Data principal (primeira selecionada)
      time: scheduleData.dates[0]?.times[0] || null, // Horário principal (primeiro selecionado)
      duration: 60,
      status: 'pendente_aceite',
      price: scheduleData.instructor.pricePerClass,
      type: scheduleData.classTypes,
      car: scheduleData.instructor.vehicle || 'Não informado',
      location: {
        fullAddress: scheduleData.instructor.location?.fullAddress || 'João Pessoa - PB',
        state: scheduleData.instructor.location?.state || 'PB',
        city: scheduleData.instructor.location?.city || 'João Pessoa',
        neighborhood: scheduleData.instructor.location?.neighborhood || '',
        address: scheduleData.instructor.location?.fullAddress || 'João Pessoa - PB'
      },
      pickupType: scheduleData.homeService ? 'busca_casa' : 'vai_local',
      paymentStatus: 'pendente',
      createdAt: new Date().toISOString(),
      // Armazenar todas as opções de horários/dias selecionados
      availableOptions: scheduleData.dates.map(dateOption => ({
        date: dateOption.date,
        times: dateOption.times
      }))
    };

    // Adicionar a nova aula ao estado
    setClasses(prevClasses => [...prevClasses, newClass]);
    
    // Navegar para a seção de aulas e mostrar pendentes de aceite
    setActiveSection('classes');
    setInitialTab('pendentes_aceite');
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

  if (!isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO
        title="Dashboard Aluno - DriveToPass"
        description="Gerencie suas aulas e encontre instrutores na DriveToPass"
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
              instructors={mockInstructors} 
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
    </div>
  );
};

export default DashboardAluno;
