import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { getAvailableTimes } from '../../../utils/availabilityUtils';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';
import { useAuth } from '../../../context/AuthContext';
import { studentsAPI } from '../../../services/api';
import ScheduleConfirmationModal from './ScheduleConfirmationModal';

const ScheduleClassModal = ({ isOpen, onClose, instructor, onConfirm }) => {
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [classTypes, setClassTypes] = useState([]);
  const [homeService, setHomeService] = useState(false);
  const [vehicleType, setVehicleType] = useState('instructor'); // 'instructor' ou 'own'
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingScheduleData, setPendingScheduleData] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tipos de aula disponíveis
  const availableClassTypes = ['Rua', 'Baliza', 'Rodovia', 'Geral'];
  
  // State para aulas agendadas (para verificar disponibilidade)
  const [allScheduledClasses, setAllScheduledClasses] = useState([]);
  
  // Load scheduled classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classes = await studentsAPI.getClasses();
        setAllScheduledClasses(classes);
      } catch (error) {
        console.error('Error loading classes:', error);
      }
    };
    
    if (isOpen && user) {
      loadClasses();
    }
  }, [isOpen, user]);

  // Resetar estado quando o modal fechar ou instrutor mudar
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDates([]);
      setSelectedTimes({});
      setClassTypes([]);
      setHomeService(false);
      setVehicleType('instructor');
      setShowWarningModal(false);
      setPendingScheduleData(null);
      setShowConfirmationModal(false);
      setIsSubmitting(false);
    }
  }, [isOpen, instructor]);

  // Garantir que vehicleType seja 'instructor' se o instrutor não oferece veículo próprio
  React.useEffect(() => {
    if (instructor && instructor.offersOwnVehicle === false && vehicleType === 'own') {
      setVehicleType('instructor');
    }
  }, [instructor, vehicleType]);

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

    // Validar tipo de veículo
    if (vehicleType === 'own' && (instructor.offersOwnVehicle === false || !instructor.priceOwnVehicle)) {
      alert('Este instrutor não oferece aulas em veículo próprio.');
      setVehicleType('instructor');
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
      homeService,
      vehicleType
    };

    // Tracking do clique em "Confirmar Agendamento" - antes do modal de aviso
    trackEvent(trackingEvents.DASHBOARD_ALUNO_SCHEDULE_CONFIRM_CLICK, {
      user_type: 'student',
      page: 'dashboard_aluno',
      section: 'schedule_modal',
      instructor_id: instructor.id,
      instructor_name: instructor.name,
      dates_count: selectedDates.length,
      total_times: Object.values(selectedTimes).flat().length,
      class_types: classTypes,
      home_service: homeService,
      vehicle_type: vehicleType,
    });

    // Mostrar modal de aviso antes de confirmar
    setPendingScheduleData(scheduleData);
    setShowWarningModal(true);
  };

  const handleConfirmWithWarning = async () => {
    // Prevenir duplicação: não permitir múltiplos envios simultâneos
    if (isSubmitting || !pendingScheduleData) {
      return;
    }

    setIsSubmitting(true);
    
    try {
        // Calcular preço total
        const vehicleTypeToUse = pendingScheduleData.vehicleType || 'instructor';
        const basePrice = vehicleTypeToUse === 'own' && instructor.priceOwnVehicle 
          ? instructor.priceOwnVehicle 
          : instructor.pricePerClass || 0;
        const homeServicePrice = pendingScheduleData.homeService && instructor.homeServicePrice 
          ? instructor.homeServicePrice 
          : 0;
        const totalPrice = basePrice + homeServicePrice;

        // Prepare class data for API
        const classData = {
          instructorId: pendingScheduleData.instructorId,
          dates: pendingScheduleData.dates,
          classTypes: pendingScheduleData.classTypes,
          homeService: pendingScheduleData.homeService,
          vehicleType: pendingScheduleData.vehicleType,
          price: totalPrice,
          basePrice: basePrice,
          homeServicePrice: homeServicePrice,
          duration: 60,
          location: instructor.location || {},
          car: vehicleTypeToUse === 'instructor' ? (instructor.vehicle || '') : 'Veículo próprio',
        };

        // Schedule class via API
        await studentsAPI.scheduleClass(classData);

        // Call onConfirm callback if provided
        if (onConfirm) {
          onConfirm(pendingScheduleData);
        }

        // Fechar modal de aviso e mostrar modal de confirmação
        setShowWarningModal(false);
        setPendingScheduleData(null);
        onClose();

        // Mostrar modal de confirmação após um pequeno delay
        setTimeout(() => {
          setShowConfirmationModal(true);
        }, 300);
      } catch (error) {
        console.error('Error scheduling class:', error);
        const errorMessage = error.message || 'Erro ao agendar aula. Por favor, tente novamente.';
        alert(errorMessage);
        setShowWarningModal(false);
        setPendingScheduleData(null);
      } finally {
        setIsSubmitting(false);
      }
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelWarning();
            }
          }}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-3 sm:p-4 md:p-6 mx-2 sm:mx-4 sm:mx-0 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">Aviso Importante</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3 md:mb-4">
                  A aula será <strong className="text-yellow-600">cancelada automaticamente</strong> se não for aceita pelo instrutor ou paga até <strong className="text-yellow-600">24 horas antes</strong> do horário marcado (ou do último horário selecionado, caso tenha múltiplas opções).
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Certifique-se de que o instrutor aceitará a aula ou que você pagará dentro do prazo para evitar o cancelamento automático.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelWarning();
                }}
                className="w-full sm:flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base"
              >
                Voltar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmWithWarning();
                }}
                disabled={isSubmitting}
                className="w-full sm:flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Confirmando...' : 'Entendi, Confirmar Agendamento'}
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Informações do Instrutor */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <img
              src={instructor.photo}
              alt={instructor.name}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 truncate">
                {instructor.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {instructor.location?.neighborhood || 'Bairro não informado'}
              </p>
              {instructor.vehicle && (
                <p className="text-xs sm:text-sm text-gray-700 font-medium mb-1">
                  🚗 {instructor.vehicle}
                </p>
              )}
              <p className="text-xs sm:text-sm text-blue-600 italic mb-2">
                O endereço completo será combinado diretamente com o instrutor
              </p>
              
              {/* Badge Premium e Tipos de Aula */}
              <div className="mb-3">
                {instructor.premium && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold rounded-full mb-2">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    PREMIUM
                  </span>
                )}
                {instructor.classTypes && instructor.classTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {instructor.classTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 py-1 bg-accent text-primary text-xs font-semibold rounded-lg"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Badges de Veículo e Busca em Casa */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Badge Veículo do Instrutor */}
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    Veículo do Instrutor
                  </span>
                  
                  {/* Badge Veículo Próprio */}
                  {(instructor.offersOwnVehicle !== false && instructor.priceOwnVehicle) && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      Veículo Próprio
                    </span>
                  )}
                  
                  {/* Badge Busca em Casa */}
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg ${
                    instructor.homeService 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Busca em Casa
                  </span>
                  
                  {/* Badge Aulas somente para mulheres */}
                  {instructor.womenOnly && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-lg">
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Aulas somente para mulheres
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  {instructor.totalClasses || 0} aulas dadas
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(instructor.rating) ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {instructor.rating} ({instructor.totalReviews} avaliações)
                </span>
              </div>

              {/* Preço - será calculado dinamicamente abaixo */}

              {/* Descrição */}
              {instructor.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                  {instructor.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Seleção de Tipo de Veículo */}
        {(instructor.offersOwnVehicle !== false) && (
          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3">
              Tipo de Veículo *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setVehicleType('instructor')}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 font-medium transition-all text-sm sm:text-base ${
                  vehicleType === 'instructor'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-accent'
                }`}
              >
                Veículo do Instrutor
                <div className="text-xs mt-1 opacity-90">
                  R$ {instructor.pricePerClass || 0}/aula
                </div>
              </button>
              <button
                onClick={() => setVehicleType('own')}
                disabled={instructor.offersOwnVehicle === false || !instructor.priceOwnVehicle}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 font-medium transition-all text-sm sm:text-base ${
                  vehicleType === 'own'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-accent'
                } ${(instructor.offersOwnVehicle === false || !instructor.priceOwnVehicle) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Meu Veículo
                <div className="text-xs mt-1 opacity-90">
                  {instructor.priceOwnVehicle 
                    ? `R$ ${instructor.priceOwnVehicle}/aula`
                    : 'Não disponível'}
                </div>
              </button>
            </div>
            {(instructor.offersOwnVehicle === false || !instructor.priceOwnVehicle) && (
              <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">
                Este instrutor não oferece aulas em veículo próprio
              </p>
            )}
          </div>
        )}

        {/* Busca em Casa - sempre mostrar, mas desabilitado se não oferecer */}
        <div className={`border rounded-xl p-3 sm:p-4 ${
          instructor.homeService 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-gray-50 border-gray-200 opacity-60'
        }`}>
          <label className={`flex items-start gap-2 sm:gap-3 ${
            instructor.homeService ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}>
            <input
              type="checkbox"
              checked={homeService}
              onChange={(e) => {
                if (instructor.homeService) {
                  setHomeService(e.target.checked);
                }
              }}
              disabled={!instructor.homeService}
              className={`w-4 h-4 sm:w-5 sm:h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5 flex-shrink-0 ${
                !instructor.homeService ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-sm sm:text-base block ${
                  instructor.homeService ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Busca em casa
                </span>
                {instructor.homeService && instructor.homeServicePrice && instructor.homeServicePrice > 0 && (
                  <span className="text-sm font-semibold text-primary">
                    + R$ {instructor.homeServicePrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              <p className={`text-xs sm:text-sm mt-1 ${
                instructor.homeService ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {instructor.homeService 
                  ? 'O instrutor buscará você no endereço informado'
                  : 'Este instrutor não oferece serviço de busca em casa'}
              </p>
            </div>
          </label>
        </div>

        {/* Seleção de Tipo de Aula */}
        <div>
          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Tipo de Aula *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {availableClassTypes.map(type => (
              <button
                key={type}
                onClick={() => handleClassTypeToggle(type)}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 font-medium transition-all text-sm sm:text-base ${
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
          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Selecione Dias e Horários *
          </label>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Você pode selecionar múltiplos dias e horários. O instrutor escolherá os que tiver disponibilidade.
            <br className="hidden sm:block" />
            <span className="font-semibold text-primary">Importante:</span> Apenas horários com <strong>mínimo de 24 horas de antecedência</strong> estão disponíveis para agendamento.
          </p>

          <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto pr-1 sm:pr-2">
            {dateOptions.map(date => {
              const isSelected = selectedDates.includes(date);
              const timesForDate = selectedTimes[date] || [];
              // Verificar se há horários disponíveis com 24h de antecedência
              const availableTimesWith24h = getAvailableTimesForDate(date);
              const hasAvailability = availableTimesWith24h.length > 0;

              return (
                <div
                  key={date}
                  className={`border-2 rounded-xl p-3 sm:p-4 transition-all ${
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
                    className="w-full flex items-center justify-between mb-2 sm:mb-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm sm:text-lg font-semibold truncate ${
                        isSelected ? 'text-primary' : hasAvailability ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {formatDateDisplay(date)}
                        {!hasAvailability && (
                          <span className="ml-1 sm:ml-2 text-xs font-normal text-gray-400">
                            (Sem disponibilidade)
                          </span>
                        )}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0 ml-2 ${
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
                        <div className="mt-2 sm:mt-3 pl-6 sm:pl-8">
                          <p className="text-xs sm:text-sm text-gray-500 italic">
                            {hasTimesButNot24h 
                              ? 'Nenhum horário disponível com antecedência mínima de 24 horas para esta data'
                              : 'Nenhum horário disponível para esta data'}
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2 sm:mt-3 pl-6 sm:pl-8">
                        {availableTimesForDate.map(time => {
                          const isTimeSelected = timesForDate.includes(time);
                          return (
                            <button
                              key={time}
                              onClick={() => handleTimeToggle(date, time)}
                              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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


        {/* Aviso de Cancelamento Automático */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-yellow-900 mb-1">Aviso Importante</h4>
              <p className="text-xs sm:text-sm text-yellow-800">
                A aula será <strong>cancelada automaticamente</strong> se não for aceita pelo instrutor ou paga até <strong>24 horas antes</strong> do horário marcado (ou do último horário selecionado, caso tenha múltiplas opções).
              </p>
            </div>
          </div>
        </div>

        {/* Resumo e Preço Total */}
        {selectedDates.length > 0 && classTypes.length > 0 && (() => {
          const basePrice = vehicleType === 'own' && instructor.priceOwnVehicle 
            ? instructor.priceOwnVehicle 
            : instructor.pricePerClass || 0;
          const homeServicePrice = homeService && instructor.homeServicePrice 
            ? instructor.homeServicePrice 
            : 0;
          const totalPrice = basePrice + homeServicePrice;
          const totalClasses = Object.values(selectedTimes).flat().length;
          const totalAmount = totalPrice * totalClasses;

          return (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Resumo do Agendamento:</h4>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 mb-3">
                <li>• {selectedDates.length} dia(s) selecionado(s)</li>
                <li>• {totalClasses} horário(s) selecionado(s)</li>
                <li>• Tipo(s): <span className="break-words">{classTypes.join(', ')}</span></li>
                <li>• Veículo: {vehicleType === 'own' ? 'Meu veículo' : 'Veículo do instrutor'}</li>
                {homeService && <li>• Busca em casa: Sim {instructor.homeServicePrice && instructor.homeServicePrice > 0 && `(+ R$ ${instructor.homeServicePrice})`}</li>}
              </ul>
              <div className="border-t border-primary/20 pt-3 mt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-700">Preço por aula:</span>
                  <span className="text-lg font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
                </div>
                {totalClasses > 1 && (
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-sm text-gray-700">Total ({totalClasses} aulas):</span>
                    <span className="text-xl font-bold text-primary">R$ {totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Valor Total da Aula (antes dos botões) */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-2 border-primary/20 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Valor Total da Aula</p>
              <div className="text-xs sm:text-sm text-gray-600">
                {vehicleType === 'own' && instructor.priceOwnVehicle ? (
                  <>
                    <span>Veículo próprio: R$ {instructor.priceOwnVehicle.toFixed(2).replace('.', ',')}</span>
                    {homeService && instructor.homeServicePrice && instructor.homeServicePrice > 0 && (
                      <span className="ml-2">+ Busca em casa: R$ {instructor.homeServicePrice.toFixed(2).replace('.', ',')}</span>
                    )}
                  </>
                ) : (
                  <>
                    <span>Veículo do instrutor: R$ {instructor.pricePerClass.toFixed(2).replace('.', ',')}</span>
                    {homeService && instructor.homeServicePrice && instructor.homeServicePrice > 0 && (
                      <span className="ml-2">+ Busca em casa: R$ {instructor.homeServicePrice.toFixed(2).replace('.', ',')}</span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                R$ {(() => {
                  const basePrice = vehicleType === 'own' && instructor.priceOwnVehicle 
                    ? instructor.priceOwnVehicle 
                    : instructor.pricePerClass || 0;
                  const homeServicePrice = homeService && instructor.homeServicePrice 
                    ? instructor.homeServicePrice 
                    : 0;
                  return (basePrice + homeServicePrice).toFixed(2).replace('.', ',');
                })()}
              </p>
              <p className="text-xs text-gray-500 mt-1">por aula</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </Modal>
    
    {/* Modal de Confirmação */}
    <ScheduleConfirmationModal
      isOpen={showConfirmationModal}
      onClose={() => {
        setShowConfirmationModal(false);
        setPendingScheduleData(null);
      }}
    />
    </>
  );
};

export default ScheduleClassModal;
