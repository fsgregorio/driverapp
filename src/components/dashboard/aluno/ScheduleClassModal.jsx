import React, { useState } from 'react';
import Modal from '../../Modal';
import { getAvailableTimes, hasAvailableTimes } from '../../../utils/availabilityUtils';
import { mockStudentClasses, mockInstructorClasses } from '../../../utils/mockData';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';

const ScheduleClassModal = ({ isOpen, onClose, instructor, onConfirm }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [classTypes, setClassTypes] = useState([]);
  const [homeService, setHomeService] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingScheduleData, setPendingScheduleData] = useState(null);

  // Tipos de aula disponíveis
  const availableClassTypes = ['Rua', 'Baliza', 'Rodovia', 'Geral'];

  // Combinar todas as aulas agendadas para verificar disponibilidade
  const allScheduledClasses = [...mockStudentClasses, ...mockInstructorClasses];

  // Resetar estado quando o modal fechar ou instrutor mudar
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDates([]);
      setSelectedTimes({});
      setClassTypes([]);
      setHomeService(false);
      setShowWarningModal(false);
      setPendingScheduleData(null);
    }
  }, [isOpen, instructor]);

  const handleDateToggle = (date) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        // Remove a data e seus horários
        const newTimes = { ...selectedTimes };
        delete newTimes[date];
        setSelectedTimes(newTimes);
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleTimeToggle = (date, time) => {
    setSelectedTimes(prev => {
      const dateTimes = prev[date] || [];
      if (dateTimes.includes(time)) {
        return {
          ...prev,
          [date]: dateTimes.filter(t => t !== time)
        };
      } else {
        return {
          ...prev,
          [date]: [...dateTimes, time]
        };
      }
    });
  };

  const handleClassTypeToggle = (type) => {
    setClassTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleConfirm = () => {
    // Validar se há pelo menos uma data e horário selecionados
    const hasDatesAndTimes = selectedDates.some(date => 
      selectedTimes[date] && selectedTimes[date].length > 0
    );

    if (!hasDatesAndTimes) {
      alert('Por favor, selecione pelo menos um dia e horário.');
      return;
    }

    if (classTypes.length === 0) {
      alert('Por favor, selecione pelo menos um tipo de aula.');
      return;
    }

    // Validar busca em casa
    if (homeService && !instructor.homeService) {
      alert('Este instrutor não oferece serviço de busca em casa.');
      return;
    }

    // Validar antecedência mínima de 24 horas para todos os horários selecionados
    const invalidTimes = [];
    selectedDates.forEach(date => {
      const times = selectedTimes[date] || [];
      times.forEach(time => {
        if (!hasMinimumAdvanceTime(date, time)) {
          invalidTimes.push({ date, time });
        }
      });
    });

    if (invalidTimes.length > 0) {
      const invalidTimesText = invalidTimes.map(({ date, time }) => {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        return `${formattedDate} às ${time}`;
      }).join(', ');
      
      alert(`Não é possível agendar aulas com menos de 24 horas de antecedência.\n\nOs seguintes horários não atendem a este requisito:\n${invalidTimesText}\n\nPor favor, selecione horários com pelo menos 24 horas de antecedência.`);
      return;
    }

    // Preparar dados para envio
    const scheduleData = {
      instructorId: instructor.id,
      instructor: instructor,
      dates: selectedDates.map(date => ({
        date,
        times: selectedTimes[date] || []
      })).filter(item => item.times.length > 0),
      classTypes,
      homeService
    };

    // Mostrar modal de aviso antes de confirmar
    setPendingScheduleData(scheduleData);
    setShowWarningModal(true);
  };

  const handleConfirmWithWarning = () => {
    if (pendingScheduleData && onConfirm) {
      // Tracking do agendamento de aula
      trackEvent(trackingEvents.DASHBOARD_ALUNO_CLASS_SCHEDULED, {
        instructor_id: pendingScheduleData.instructorId,
        instructor_name: pendingScheduleData.instructor?.name,
        dates_count: pendingScheduleData.dates.length,
        total_times: pendingScheduleData.dates.reduce((sum, date) => sum + (date.times?.length || 0), 0),
        class_types: pendingScheduleData.classTypes,
        home_service: pendingScheduleData.homeService,
        page: 'dashboard_aluno',
        section: 'schedule_modal'
      });
      
      onConfirm(pendingScheduleData);
    }
    setShowWarningModal(false);
    setPendingScheduleData(null);
    onClose();
  };

  const handleCancelWarning = () => {
    setShowWarningModal(false);
    setPendingScheduleData(null);
  };

  // Verificar se um horário tem pelo menos 24h de antecedência
  const hasMinimumAdvanceTime = (date, time) => {
    const now = new Date();
    const classDateTime = new Date(`${date}T${time}`);
    const timeDifference = classDateTime.getTime() - now.getTime();
    const hoursUntilClass = timeDifference / (1000 * 60 * 60);
    return hoursUntilClass >= 24;
  };

  // Gerar próximos 14 dias para seleção
  // Nota: A validação de 24h será feita nos horários disponíveis, não nas datas
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    // Começar a partir de amanhã (dia +1)
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Obter horários disponíveis para uma data específica (filtrando por antecedência mínima de 24h)
  const getAvailableTimesForDate = (date) => {
    if (!instructor) return [];
    const allAvailableTimes = getAvailableTimes(instructor, date, allScheduledClasses);
    // Filtrar apenas horários com pelo menos 24h de antecedência
    return allAvailableTimes.filter(time => hasMinimumAdvanceTime(date, time));
  };

  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    }

    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const dateOptions = generateDateOptions();

  if (!instructor) return null;

  return (
    <>
      {/* Modal de Aviso de Cancelamento Automático */}
      {showWarningModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelWarning();
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aviso Importante</h3>
                <p className="text-gray-700 mb-4">
                  A aula será <strong className="text-yellow-600">cancelada automaticamente</strong> se não for aceita pelo instrutor ou paga até <strong className="text-yellow-600">24 horas antes</strong> do horário marcado (ou do último horário selecionado, caso tenha múltiplas opções).
                </p>
                <p className="text-sm text-gray-600">
                  Certifique-se de que o instrutor aceitará a aula ou que você pagará dentro do prazo para evitar o cancelamento automático.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelWarning();
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmWithWarning();
                }}
                className="flex-1 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Entendi, Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Agendar Aula"
        hideFooter={true}
      >
      <div className="space-y-6">
        {/* Informações do Instrutor */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <img
              src={instructor.photo}
              alt={instructor.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {instructor.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {instructor.location?.neighborhood && instructor.location?.city && instructor.location?.state
                  ? `${instructor.location.neighborhood} - ${instructor.location.city}/${instructor.location.state}`
                  : instructor.location?.city && instructor.location?.state
                  ? `${instructor.location.city}/${instructor.location.state}`
                  : instructor.location?.fullAddress || 'Localização não informada'}
              </p>
              
              {/* Badge Premium e Tipos de Aula */}
              <div className="mb-3">
                {instructor.premium && (
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold rounded-full mb-2">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    PREMIUM
                  </span>
                )}
                {instructor.classTypes && instructor.classTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {instructor.classTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-accent text-primary text-xs font-semibold rounded-lg"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-600 mr-2">
                  {instructor.totalClasses || 0} aulas dadas
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(instructor.rating) ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {instructor.rating} ({instructor.totalReviews} avaliações)
                </span>
              </div>


              {/* Preço */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  R$ {instructor.pricePerClass}
                </span>
                <span className="text-gray-500">/aula</span>
              </div>

              {/* Descrição */}
              {instructor.description && (
                <p className="text-sm text-gray-600 mt-3">
                  {instructor.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Seleção de Tipo de Aula */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Tipo de Aula *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableClassTypes.map(type => (
              <button
                key={type}
                onClick={() => handleClassTypeToggle(type)}
                className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  classTypes.includes(type)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-accent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Datas e Horários */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Selecione Dias e Horários *
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Você pode selecionar múltiplos dias e horários. O instrutor escolherá os que tiver disponibilidade.
            <br />
            <span className="font-semibold text-primary">Importante:</span> Apenas horários com <strong>mínimo de 24 horas de antecedência</strong> estão disponíveis para agendamento.
          </p>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {dateOptions.map(date => {
              const isSelected = selectedDates.includes(date);
              const timesForDate = selectedTimes[date] || [];
              // Verificar se há horários disponíveis com 24h de antecedência
              const availableTimesWith24h = getAvailableTimesForDate(date);
              const hasAvailability = availableTimesWith24h.length > 0;

              return (
                <div
                  key={date}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isSelected
                      ? 'border-primary bg-accent'
                      : hasAvailability
                      ? 'border-gray-200 bg-white hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Data */}
                  <button
                    onClick={() => handleDateToggle(date)}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-lg font-semibold ${
                        isSelected ? 'text-primary' : hasAvailability ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {formatDateDisplay(date)}
                        {!hasAvailability && (
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            (Sem disponibilidade)
                          </span>
                        )}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isSelected ? 'rotate-180 text-primary' : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Horários */}
                  {isSelected && (() => {
                    const availableTimesForDate = getAvailableTimesForDate(date);
                    const allTimesForDate = instructor ? getAvailableTimes(instructor, date, allScheduledClasses) : [];
                    const hasTimesButNot24h = allTimesForDate.length > 0 && availableTimesForDate.length === 0;
                    
                    if (availableTimesForDate.length === 0) {
                      return (
                        <div className="mt-3 pl-8">
                          <p className="text-sm text-gray-500 italic">
                            {hasTimesButNot24h 
                              ? 'Nenhum horário disponível com antecedência mínima de 24 horas para esta data'
                              : 'Nenhum horário disponível para esta data'}
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-3 pl-8">
                        {availableTimesForDate.map(time => {
                          const isTimeSelected = timesForDate.includes(time);
                          return (
                            <button
                              key={time}
                              onClick={() => handleTimeToggle(date, time)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                isTimeSelected
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:bg-accent'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Busca em Casa */}
        {instructor.homeService && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={homeService}
                onChange={(e) => setHomeService(e.target.checked)}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div>
                <span className="font-semibold text-gray-900">
                  Busca em casa
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  O instrutor buscará você no endereço informado
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Aviso de Cancelamento Automático */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-1">Aviso Importante</h4>
              <p className="text-sm text-yellow-800">
                A aula será <strong>cancelada automaticamente</strong> se não for aceita pelo instrutor ou paga até <strong>24 horas antes</strong> do horário marcado (ou do último horário selecionado, caso tenha múltiplas opções).
              </p>
            </div>
          </div>
        </div>

        {/* Resumo */}
        {selectedDates.length > 0 && classTypes.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Resumo do Agendamento:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• {selectedDates.length} dia(s) selecionado(s)</li>
              <li>• {Object.values(selectedTimes).flat().length} horário(s) selecionado(s)</li>
              <li>• Tipo(s): {classTypes.join(', ')}</li>
              {homeService && <li>• Busca em casa: Sim</li>}
            </ul>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
            className="flex-1 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default ScheduleClassModal;
