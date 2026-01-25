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
    <div className="space-y-4 sm:space-y-6">
      {/* Tabs */}
      <div className="mb-4 sm:mb-6 border-b border-gray-200 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'search'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Busca de Instrutores
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'favorites'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Instrutores Favoritos
          </button>
        </div>
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
