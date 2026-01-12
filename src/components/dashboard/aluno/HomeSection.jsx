import React from 'react';
import PendingClassesCard from './PendingClassesCard';
import IndicatorsListCard from './IndicatorsListCard';
import { 
  getAgendadasClasses,
  getPendingAcceptanceClasses, 
  getPendingPaymentClasses, 
  getPendingEvaluationClasses,
  calculateStudentIndicators 
} from '../../../utils/classUtils';
import { formatDateTime } from '../../../utils/dateUtils';

const HomeSection = ({ classes, onNavigateToSection }) => {
  const agendadas = getAgendadasClasses(classes);
  const pendingAcceptance = getPendingAcceptanceClasses(classes);
  const pendingPayment = getPendingPaymentClasses(classes);
  const pendingEvaluation = getPendingEvaluationClasses(classes);
  
  const indicators = calculateStudentIndicators(classes);
  const upcomingClasses = indicators.upcomingClasses;
  const completedByType = indicators.completedByType;
  const favoriteInstructors = indicators.favoriteInstructors;

  const handleViewAgendadas = () => {
    if (onNavigateToSection) {
      onNavigateToSection('classes', 'agendadas');
    }
  };

  const handleViewPendingAcceptance = () => {
    if (onNavigateToSection) {
      onNavigateToSection('classes', 'pendentes_aceite');
    }
  };

  const handleViewPendingPayment = () => {
    if (onNavigateToSection) {
      onNavigateToSection('classes', 'pendentes_pagamento');
    }
  };

  const handleViewPendingEvaluation = () => {
    if (onNavigateToSection) {
      onNavigateToSection('classes', 'pendentes_avaliacao');
    }
  };

  // Formatar aulas concluídas por tipo para exibição em lista
  const formatCompletedByTypeList = () => {
    const entries = Object.entries(completedByType);
    if (entries.length === 0) return [];
    
    return entries.map(([type, count]) => ({
      label: type,
      count: count
    }));
  };

  // Formatar instrutores favoritos para exibição em lista
  const formatFavoriteInstructorsList = () => {
    if (favoriteInstructors.length === 0) return [];
    
    return favoriteInstructors.map(instructor => ({
      label: instructor.name,
      count: `${instructor.count} aula${instructor.count > 1 ? 's' : ''}`
    }));
  };

  // Formatar próximas aulas para exibição em lista
  const formatUpcomingClassesList = () => {
    if (upcomingClasses.length === 0) return [];
    
    return upcomingClasses.map(cls => ({
      label: formatDateTime(cls.date, cls.time),
      subtitle: `com ${cls.instructorName}`
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
        <p className="text-gray-600">Acompanhe suas aulas e indicadores</p>
      </div>

      {/* Cards Principais */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aulas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PendingClassesCard
            title="Aulas Agendadas"
            count={agendadas.length}
            color="blue"
            onClick={handleViewAgendadas}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <PendingClassesCard
            title="Aguardando Aceite"
            count={pendingAcceptance.length}
            color="yellow"
            onClick={handleViewPendingAcceptance}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <PendingClassesCard
            title="Aguardando Pagamento"
            count={pendingPayment.length}
            color="orange"
            onClick={handleViewPendingPayment}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <PendingClassesCard
            title="Aguardando Avaliação"
            count={pendingEvaluation.length}
            color="green"
            onClick={handleViewPendingEvaluation}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Indicadores */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Indicadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IndicatorsListCard
            title="Aulas Concluídas"
            total={indicators.completedClasses}
            items={formatCompletedByTypeList()}
            color="green"
            emptyMessage="Nenhuma aula concluída"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <IndicatorsListCard
            title="Próximas Aulas"
            total={upcomingClasses.length}
            items={formatUpcomingClassesList()}
            color="purple"
            emptyMessage="Nenhuma aula agendada nos próximos 7 dias"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <IndicatorsListCard
            title="Instrutores Favoritos"
            total={favoriteInstructors.length}
            items={formatFavoriteInstructorsList()}
            color="orange"
            emptyMessage="Ainda não há instrutores favoritos"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
