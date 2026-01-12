import React, { useState, useEffect } from 'react';
import { isBefore24Hours } from '../../../utils/dateUtils';
import { getClassTypeLabel, normalizeClassTypes, getClassTypeBadgeColor } from '../../../utils/classUtils';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';

const CancelRescheduleModal = ({ 
  isOpen, 
  onClose, 
  classData, 
  mode = 'cancel', // 'cancel' or 'reschedule'
  onConfirm 
}) => {
  const [showRefundWarning, setShowRefundWarning] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: ''
  });
  const [isBefore24h, setIsBefore24h] = useState(false);

  useEffect(() => {
    if (isOpen && classData) {
      const before24h = isBefore24Hours(classData.date, classData.time);
      setIsBefore24h(before24h);
      
      // Aviso de reembolso apenas para aulas pagas (agendadas/confirmadas) canceladas/reagendadas com menos de 24h
      // Não mostrar para pendentes de aceite ou pagamento (não foram pagas)
      const isPaid = classData.paymentStatus === 'pago';
      const isScheduledOrConfirmed = classData.status === 'agendada' || classData.status === 'confirmada';
      const shouldShowRefund = before24h && isPaid && isScheduledOrConfirmed;
      
      setShowRefundWarning(shouldShowRefund);
    }
  }, [isOpen, classData]);

  useEffect(() => {
    if (isOpen && mode === 'reschedule') {
      // Preencher com data/hora atual da aula
      setRescheduleForm({
        date: classData?.date || '',
        time: classData?.time || ''
      });
    }
  }, [isOpen, mode, classData]);

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const handleConfirm = () => {
    if (mode === 'cancel') {
      // Tracking do cancelamento
      trackEvent(trackingEvents.DASHBOARD_ALUNO_CLASS_CANCELED, {
        class_id: classData.id,
        instructor_id: classData.instructorId,
        instructor_name: classData.instructorName,
        class_date: classData.date,
        class_time: classData.time,
        class_status: classData.status,
        payment_status: classData.paymentStatus,
        is_before_24h: isBefore24h,
        page: 'dashboard_aluno',
        section: 'cancel_modal'
      });
      
      if (onConfirm) {
        onConfirm(classData.id, null);
      }
      handleClose();
    } else {
      // Reschedule
      if (rescheduleForm.date && rescheduleForm.time) {
        if (onConfirm) {
          onConfirm(classData.id, {
            date: rescheduleForm.date,
            time: rescheduleForm.time
          });
        }
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setShowRefundWarning(false);
    setRescheduleForm({ date: '', time: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'cancel' ? 'Cancelar Aula' : 'Reagendar Aula'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Aviso de Reembolso - apenas para aulas pagas canceladas/reagendadas com menos de 24h */}
        {showRefundWarning && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Atenção!</h3>
                <p className="text-sm text-yellow-700">
                  Você está cancelando/reagendando com menos de 24 horas de antecedência. 
                  Neste caso, será reembolsado apenas <strong>50% do valor pago</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informações da Aula */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{classData?.date} às {classData?.time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{classData?.location?.fullAddress || classData?.location}</span>
            </div>
            <div className="flex items-center flex-wrap gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm">Tipo:</span>
              <div className="flex flex-wrap gap-1">
                {normalizeClassTypes(classData?.type).map((type, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getClassTypeBadgeColor(type)}`}
                  >
                    {getClassTypeLabel(type)}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm">Carro: <span className="font-medium">{classData?.car || 'Não informado'}</span></span>
            </div>
            <div className="flex items-center text-gray-700 pt-2 border-t border-gray-200">
              <span className="font-semibold">Valor: R$ {classData?.price?.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Formulário de Reagendamento */}
        {mode === 'reschedule' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nova Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={rescheduleForm.date}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                min={getMinDate()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Novo Horário <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={rescheduleForm.time}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* Confirmação */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            {mode === 'cancel' 
              ? 'Tem certeza que deseja cancelar esta aula?' 
              : 'Confirme os novos dados para reagendar a aula.'}
          </p>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleConfirm}
            disabled={mode === 'reschedule' && (!rescheduleForm.date || !rescheduleForm.time)}
            className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-colors ${
              mode === 'cancel'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
            }`}
          >
            {mode === 'cancel' ? 'Confirmar Cancelamento' : 'Confirmar Reagendamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRescheduleModal;
