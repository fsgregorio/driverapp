import React, { useState } from 'react';
import InstructorSearch from './InstructorSearch';
import FavoriteInstructors from './FavoriteInstructors';
import ScheduleClassModal from './ScheduleClassModal';

const InstructorControl = ({ onScheduleClass, initialTab = 'search' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // search, favorites
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const handleScheduleFromInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedInstructor(null);
  };

  const handleConfirmSchedule = (scheduleData) => {
    // Aqui você pode fazer a chamada à API ou processar os dados
    console.log('Dados do agendamento:', scheduleData);
    
    if (onScheduleClass) {
      onScheduleClass(scheduleData);
    }
    
    // Aqui você pode adicionar lógica para salvar o agendamento
    // Por exemplo: criar uma aula pendente de aceite
  };

  const handleNavigateToSearch = () => {
    setActiveTab('search');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'search'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Busca de Instrutores
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Instrutores Favoritos
        </button>
      </div>

      {/* Content */}
      {activeTab === 'search' && (
        <InstructorSearch onScheduleClass={handleScheduleFromInstructor} />
      )}

      {activeTab === 'favorites' && (
        <FavoriteInstructors 
          onScheduleClass={handleScheduleFromInstructor}
          onNavigateToSearch={handleNavigateToSearch}
        />
      )}

      {/* Modal de Agendamento */}
      <ScheduleClassModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        instructor={selectedInstructor}
        onConfirm={handleConfirmSchedule}
      />
    </div>
  );
};

export default InstructorControl;
