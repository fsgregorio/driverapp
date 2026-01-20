import React, { useState } from 'react';
import { getClassTypeLabel, normalizeClassTypes, getClassTypeBadgeColor } from '../../../utils/classUtils';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';

const PaymentModal = ({ isOpen, onClose, classData, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Tracking do início do pagamento - EVENTO CRÍTICO PARA MVP
    trackEvent(trackingEvents.PAYMENT_INITIATED, {
      user_type: 'student',
      page: 'dashboard_aluno',
      section: 'payment_modal',
      class_id: classData?.id,
      class_price: classData?.price,
      payment_method: paymentMethod,
      instructor_id: classData?.instructorId,
      instructor_name: classData?.instructorName,
    });
    
    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      if (onConfirm) {
        // Tracking será feito no ClassControl quando o pagamento for confirmado
        onConfirm(classData.id, paymentMethod);
      }
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setPaymentMethod('credit_card');
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pagamento</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Informações da Aula */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Instrutor:</span>
              <span className="font-semibold">{classData?.instructorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Data e Hora:</span>
              <span className="font-semibold">{classData?.date} às {classData?.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tipo de Aula:</span>
              <div className="flex flex-wrap gap-1 justify-end">
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
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Carro:</span>
              <span className="font-semibold">{classData?.car || 'Não informado'}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total a pagar:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {classData?.price?.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Método de Pagamento
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
                disabled={isProcessing}
              />
              <div className="flex items-center flex-1">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium">Cartão de Crédito</span>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="debit_card"
                checked={paymentMethod === 'debit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
                disabled={isProcessing}
              />
              <div className="flex items-center flex-1">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium">Cartão de Débito</span>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="pix"
                checked={paymentMethod === 'pix'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
                disabled={isProcessing}
              />
              <div className="flex items-center flex-1">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">PIX</span>
              </div>
            </label>
          </div>
        </div>

        {/* Informação de Segurança */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-blue-700">
              Seus dados de pagamento são processados de forma segura e criptografada.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              'Pagar Agora'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
