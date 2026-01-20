import React, { useEffect } from 'react';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';

const PaymentComingSoonModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleGetCoupon = () => {
    // Tracking do evento - EVENTO CRÍTICO PARA MVP
    trackEvent(trackingEvents.COUPON_REQUESTED, {
      user_type: 'student',
      page: 'dashboard_aluno',
      section: 'payment_coming_soon_modal',
      source: 'payment_modal',
    });
    
    // TODO: Implementar ação para obter cupom
    // Por exemplo: redirecionar para página de cadastro ou fazer chamada de API
    console.log('Quero meu cupom');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] shadow-2xl animate-slideUp flex flex-col mx-4 sm:mx-0 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar - posição absoluta */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full z-10"
          aria-label="Fechar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-4">
            {/* Ícone e Mensagem Principal */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-3">
                <svg 
                  className="h-8 w-8 text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Estamos em fase de teste!
              </h3>
              <p className="text-gray-600">
                A plataforma estará funcionando em breve.
              </p>
            </div>

            {/* Mensagem sobre o cupom */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-yellow-900 font-semibold mb-1 text-sm">
                    🎁 Ganhe um cupom de desconto!
                  </p>
                  <p className="text-yellow-800 text-xs">
                    Clique no botão abaixo para garantir seu <strong>cupom exclusivo</strong> quando a plataforma estiver funcionando. Você será um dos primeiros a ser notificado!
                  </p>
                </div>
              </div>
            </div>

            {/* Botão de Cupom */}
            <button
              onClick={handleGetCoupon}
              className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Quero meu cupom
            </button>

            {/* Botão de Fechar */}
            <button
              onClick={handleClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComingSoonModal;
