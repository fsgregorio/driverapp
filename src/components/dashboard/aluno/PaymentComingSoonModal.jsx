import React, { useEffect, useState } from 'react';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';

const PaymentComingSoonModal = ({ isOpen, onClose }) => {
  const [showCoupon, setShowCoupon] = useState(false);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    // Resetar estado quando o modal fechar
    if (!isOpen) {
      setShowCoupon(false);
      setCopied(false);
    }
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
    
    // Mostrar o cupom
    setShowCoupon(true);
  };

  const handleCopyCoupon = () => {
    const couponCode = 'USUARIODIAMANTE';
    navigator.clipboard.writeText(couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

            {!showCoupon ? (
              <>
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
              </>
            ) : (
              <>
                {/* Exibição do Cupom */}
                <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 border-2 border-primary/30 rounded-xl p-6 text-center">
                  <div className="mb-4">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-3">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      🎉 Parabéns! Seu cupom está aqui!
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Use este cupom quando a plataforma estiver funcionando para obter seu desconto exclusivo.
                    </p>
                  </div>
                  
                  {/* Código do Cupom */}
                  <div className="bg-white border-2 border-dashed border-primary rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">SEU CUPOM EXCLUSIVO</p>
                    <div className="flex items-center justify-center gap-3">
                      <code className="text-2xl font-bold text-primary tracking-wider">
                        USUARIODIAMANTE
                      </code>
                      <button
                        onClick={handleCopyCoupon}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copiar cupom"
                      >
                        {copied ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-xs mt-2 font-medium">✓ Cupom copiado!</p>
                    )}
                  </div>
                </div>
              </>
            )}

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
