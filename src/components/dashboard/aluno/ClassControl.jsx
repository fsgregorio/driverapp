import React, { useState, useEffect } from 'react';
import ClassCardEnhanced from './ClassCardEnhanced';
import CancelRescheduleModal from './CancelRescheduleModal';
import PaymentModal from './PaymentModal';
import FavoriteInstructorModal from './FavoriteInstructorModal';
import { mockStudentClasses } from '../../../utils/mockData';
import { 
  getAgendadasClasses, 
  getPendingAcceptanceClasses, 
  getPendingPaymentClasses, 
  getPendingEvaluationClasses, 
  getHistoryClasses 
} from '../../../utils/classUtils';

const ClassControl = ({ instructors, onScheduleClass, initialTab = 'agendadas', classes: propClasses, onClassesChange }) => {
  const [classes, setClasses] = useState(propClasses || mockStudentClasses);
  const [activeTab, setActiveTab] = useState(initialTab); // agendadas, pendentes_aceite, pendentes_pagamento, pendentes_avaliacao, historico

  // Sincronizar classes quando propClasses mudar
  useEffect(() => {
    if (propClasses) {
      setClasses(propClasses);
    }
  }, [propClasses]);

  // Função para atualizar classes localmente e notificar o pai
  const updateClasses = (updatedClasses) => {
    setClasses(updatedClasses);
    if (onClassesChange) {
      onClassesChange(updatedClasses);
    }
  };

  // Sincronizar activeTab quando initialTab mudar
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [favoriteInstructors, setFavoriteInstructors] = useState([]); // Lista de IDs de instrutores favoritos
  const [scheduleForm, setScheduleForm] = useState({
    instructorId: '',
    date: '',
    time: '',
    type: ['Baliza'],
    pickupType: 'vai_local'
  });

  // Calcular contadores para cada tab
  const agendadas = getAgendadasClasses(classes);
  const pendentesAceite = getPendingAcceptanceClasses(classes);
  const pendentesPagamento = getPendingPaymentClasses(classes);
  const pendentesAvaliacao = getPendingEvaluationClasses(classes);
  const historico = getHistoryClasses(classes);

  // Função para obter as aulas filtradas baseado na tab ativa
  const getFilteredClasses = () => {
    switch (activeTab) {
      case 'agendadas':
        return agendadas;
      case 'pendentes_aceite':
        return pendentesAceite;
      case 'pendentes_pagamento':
        return pendentesPagamento;
      case 'pendentes_avaliacao':
        return pendentesAvaliacao;
      case 'historico':
        return historico;
      default:
        return agendadas;
    }
  };

  const filteredClasses = getFilteredClasses();

  const handleCancel = (classId) => {
    const classToCancel = classes.find(c => c.id === classId);
    if (classToCancel) {
      setSelectedClass(classToCancel);
      setShowCancelModal(true);
    }
  };

  const handleReschedule = (classId) => {
    const classToReschedule = classes.find(c => c.id === classId);
    if (classToReschedule) {
      setSelectedClass(classToReschedule);
      setShowRescheduleModal(true);
    }
  };

  const handlePay = (classId) => {
    const classToPay = classes.find(c => c.id === classId);
    if (classToPay) {
      setSelectedClass(classToPay);
      setShowPaymentModal(true);
    }
  };

  const handleEvaluate = (classId) => {
    // TODO: Implementar modal de avaliação
    const classToEvaluate = classes.find(c => c.id === classId);
    if (classToEvaluate) {
      // Por enquanto apenas mostra um alert
      alert(`Avaliar aula com ${classToEvaluate.instructorName}`);
      // TODO: Abrir modal de avaliação quando implementado
    }
  };

  const handleFavoriteInstructor = (classData) => {
    const instructorId = classData.instructorId;
    const isAlreadyFavorite = favoriteInstructors.includes(instructorId);
    
    // Se já for favorito, desfavoritar diretamente
    if (isAlreadyFavorite) {
      const updatedFavorites = favoriteInstructors.filter(id => id !== instructorId);
      setFavoriteInstructors(updatedFavorites);
      localStorage.setItem('driveToPass_favoriteInstructors', JSON.stringify(updatedFavorites));
      // Disparar evento customizado para notificar outros componentes
      window.dispatchEvent(new CustomEvent('favoriteInstructorsChanged', { detail: updatedFavorites }));
      return;
    }
    
    // Se não for favorito, mostrar modal de confirmação
    setSelectedInstructor({
      id: instructorId,
      name: classData.instructorName,
      photo: classData.instructorPhoto
    });
    setShowFavoriteModal(true);
  };

  const confirmFavoriteInstructor = (instructor) => {
    // TODO: Substituir por chamada de API real
    const instructorId = instructor.id || instructor.instructorId;
    
    // Adicionar aos favoritos se ainda não estiver
    if (!favoriteInstructors.includes(instructorId)) {
      const updatedFavorites = [...favoriteInstructors, instructorId];
      setFavoriteInstructors(updatedFavorites);
      // Salvar no localStorage (temporário até integração com API)
      const savedFavorites = JSON.parse(localStorage.getItem('driveToPass_favoriteInstructors') || '[]');
      if (!savedFavorites.includes(instructorId)) {
        const newFavorites = [...savedFavorites, instructorId];
        localStorage.setItem('driveToPass_favoriteInstructors', JSON.stringify(newFavorites));
        // Disparar evento customizado para notificar outros componentes
        window.dispatchEvent(new CustomEvent('favoriteInstructorsChanged', { detail: newFavorites }));
      }
    }
    
    console.log('Instrutor favoritado:', instructor);
    // Aqui você pode adicionar a lógica para salvar o instrutor favorito
    // Por exemplo: fazer uma chamada de API
  };

  // Carregar favoritos do localStorage ao montar o componente
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = JSON.parse(localStorage.getItem('driveToPass_favoriteInstructors') || '[]');
      setFavoriteInstructors(savedFavorites);
    };
    
    loadFavorites();
    
    // Ouvir mudanças no localStorage de outros componentes
    const handleStorageChange = (e) => {
      if (e.key === 'driveToPass_favoriteInstructors' || !e.key) {
        loadFavorites();
      }
    };
    
    // Ouvir evento customizado
    const handleFavoriteChange = (e) => {
      setFavoriteInstructors(e.detail);
    };
    
    window.addEventListener('favoriteInstructorsChanged', handleFavoriteChange);
    
    // Ouvir mudanças no localStorage (de outras abas/janelas)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('favoriteInstructorsChanged', handleFavoriteChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const confirmCancel = (classId, rescheduleData) => {
    // TODO: Substituir por chamada de API real
    const updatedClasses = classes.map(c => 
      c.id === classId ? { ...c, status: 'cancelada' } : c
    );
    updateClasses(updatedClasses);
    setShowCancelModal(false);
    setSelectedClass(null);
    // Aqui poderia mostrar uma mensagem de sucesso
  };

  const confirmReschedule = (classId, newData) => {
    // TODO: Substituir por chamada de API real
    const updatedClasses = classes.map(c => 
      c.id === classId ? { 
        ...c, 
        date: newData.date,
        time: newData.time
      } : c
    );
    updateClasses(updatedClasses);
    setShowRescheduleModal(false);
    setSelectedClass(null);
    // Aqui poderia mostrar uma mensagem de sucesso
  };

  const confirmPayment = (classId, paymentMethod) => {
    // TODO: Substituir por chamada de API real
    const updatedClasses = classes.map(c => 
      c.id === classId ? { 
        ...c, 
        status: 'agendada',
        paymentStatus: 'pago'
      } : c
    );
    updateClasses(updatedClasses);
    setShowPaymentModal(false);
    setSelectedClass(null);
    // Aqui poderia mostrar uma mensagem de sucesso
  };

  // Função para simular aceite do instrutor (mudar de pendente_aceite para pendente_pagamento)
  // Esta função será chamada quando o instrutor aceitar a aula no dashboard do instrutor
  // Por enquanto, vamos criar uma função que pode ser chamada manualmente para testes
  const handleInstructorAccept = (classId, selectedDate, selectedTime) => {
    const updatedClasses = classes.map(c => {
      if (c.id === classId && c.status === 'pendente_aceite') {
        return {
          ...c,
          status: 'pendente_pagamento',
          date: selectedDate || c.date,
          time: selectedTime || c.time,
          // Remover availableOptions após aceite
          availableOptions: undefined
        };
      }
      return c;
    });
    updateClasses(updatedClasses);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Substituir por chamada de API real
    const instructor = instructors.find(i => i.id === parseInt(scheduleForm.instructorId));
    if (!instructor) return;

    const newClass = {
      id: Date.now(),
      instructorId: instructor.id,
      instructorName: instructor.name,
      instructorPhoto: instructor.photo,
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: 60,
      status: 'pendente_aceite',
      price: instructor.pricePerClass,
      type: scheduleForm.type,
      car: instructor.vehicle,
      location: {
        fullAddress: instructor.location?.fullAddress || 'João Pessoa - PB',
        state: instructor.location?.state || 'PB',
        city: instructor.location?.city || 'João Pessoa',
        neighborhood: instructor.location?.neighborhood || '',
        address: instructor.location?.fullAddress || instructor.location || 'João Pessoa - PB'
      },
      pickupType: scheduleForm.pickupType,
      paymentStatus: 'pendente',
      createdAt: new Date().toISOString()
    };

    const updatedClasses = [...classes, newClass];
    updateClasses(updatedClasses);
    setShowScheduleModal(false);
    setScheduleForm({ instructorId: '', date: '', time: '', type: ['Baliza'], pickupType: 'vai_local' });
    
    if (onScheduleClass) {
      onScheduleClass(newClass);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('agendadas')}
          className={`pb-3 sm:pb-4 px-2 sm:px-4 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'agendadas'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="hidden sm:inline">Agendadas</span>
          <span className="sm:hidden">Agend.</span> ({agendadas.length})
        </button>
        <button
          onClick={() => setActiveTab('pendentes_aceite')}
          className={`pb-3 sm:pb-4 px-2 sm:px-4 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'pendentes_aceite'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="hidden sm:inline">Pendentes de Aceite</span>
          <span className="sm:hidden">Aceite</span> ({pendentesAceite.length})
        </button>
        <button
          onClick={() => setActiveTab('pendentes_pagamento')}
          className={`pb-3 sm:pb-4 px-2 sm:px-4 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'pendentes_pagamento'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="hidden sm:inline">Pendentes de Pagamento</span>
          <span className="sm:hidden">Pagamento</span> ({pendentesPagamento.length})
        </button>
        <button
          onClick={() => setActiveTab('pendentes_avaliacao')}
          className={`pb-3 sm:pb-4 px-2 sm:px-4 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'pendentes_avaliacao'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="hidden sm:inline">Pendentes de Avaliação</span>
          <span className="sm:hidden">Avaliação</span> ({pendentesAvaliacao.length})
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`pb-3 sm:pb-4 px-2 sm:px-4 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'historico'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Histórico ({historico.length})
        </button>
      </div>

      {/* Classes List */}
      <div className="grid gap-6">
        {filteredClasses.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-lg">
              {activeTab === 'historico' 
                ? 'Nenhuma aula no histórico' 
                : activeTab === 'pendentes_aceite'
                ? 'Nenhuma aula pendente de aceite'
                : activeTab === 'pendentes_pagamento'
                ? 'Nenhuma aula pendente de pagamento'
                : activeTab === 'pendentes_avaliacao'
                ? 'Nenhuma aula pendente de avaliação'
                : activeTab === 'agendadas'
                ? 'Nenhuma aula agendada'
                : 'Nenhuma aula encontrada'}
            </p>
            {activeTab !== 'historico' && (
              <p className="text-gray-500 mt-2">Agende sua primeira aula!</p>
            )}
          </div>
        )}

        {filteredClasses.map((classItem) => (
          <ClassCardEnhanced
            key={classItem.id}
            classData={classItem}
            onCancel={handleCancel}
            onReschedule={handleReschedule}
            onPay={handlePay}
            onEvaluate={handleEvaluate}
            onFavoriteInstructor={handleFavoriteInstructor}
            isFavorite={favoriteInstructors.includes(classItem.instructorId)}
          />
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Agendar Aula</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instrutor <span className="text-red-500">*</span>
                </label>
                <select
                  value={scheduleForm.instructorId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, instructorId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                >
                  <option value="">Selecione um instrutor</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name} - R$ {instructor.pricePerClass}/aula
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Aula <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['Baliza', 'Rua', 'Rodovia', 'Geral'].map((type) => (
                    <label key={type} className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={scheduleForm.type.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setScheduleForm({
                              ...scheduleForm,
                              type: [...scheduleForm.type, type]
                            });
                          } else {
                            setScheduleForm({
                              ...scheduleForm,
                              type: scheduleForm.type.filter(t => t !== type)
                            });
                          }
                        }}
                        className="mr-3 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                {scheduleForm.type.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">Selecione pelo menos um tipo de aula</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Atendimento <span className="text-red-500">*</span>
                </label>
                <select
                  value={scheduleForm.pickupType}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, pickupType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                >
                  <option value="vai_local">Vou até o local</option>
                  <option value="busca_casa">Busca em casa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  min={getMinDate()}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={scheduleForm.type.length === 0}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cancelamento */}
      <CancelRescheduleModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        mode="cancel"
        onConfirm={confirmCancel}
      />

      {/* Modal de Reagendamento */}
      <CancelRescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        mode="reschedule"
        onConfirm={confirmReschedule}
      />

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        onConfirm={confirmPayment}
      />

      {/* Modal de Favoritar Instrutor */}
      <FavoriteInstructorModal
        isOpen={showFavoriteModal}
        onClose={() => {
          setShowFavoriteModal(false);
          setSelectedInstructor(null);
        }}
        instructor={selectedInstructor}
        onConfirm={confirmFavoriteInstructor}
      />
    </div>
  );
};

export default ClassControl;
