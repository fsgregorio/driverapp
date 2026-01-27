import React, { useEffect, useState } from 'react';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';
import { suggestionsAPI, studentsAPI } from '../../../services/api';

const PaymentComingSoonModal = ({ isOpen, onClose, classId, onComplete }) => {
  const [showCoupon, setShowCoupon] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [suggestionSent, setSuggestionSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      setSuggestion('');
      setSuggestionSent(false);
      setIsSubmitting(false);
      setSubmitError('');
    }
  }, [isOpen]);

  const handleClose = async (shouldComplete = false) => {
    // Se houver uma aula associada e devemos completar, atualizar status e redirecionar
    if (shouldComplete && classId && onComplete) {
      try {
        // Atualizar status da aula para concluída
        await studentsAPI.updateClassStatus(classId, 'concluida');
        console.log('✅ Aula atualizada para concluída:', classId);
        
        // Chamar callback para redirecionar e atualizar estado
        onComplete();
      } catch (error) {
        console.error('Erro ao atualizar status da aula:', error);
        // Continuar com o fechamento mesmo se houver erro
      }
    }
    
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

  const handleSendSuggestion = async () => {
    if (!suggestion.trim()) {
      setSubmitError('Por favor, digite uma sugestão antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Salvar sugestão no banco de dados
      const savedSuggestion = await suggestionsAPI.createSuggestion({
        suggestion: suggestion.trim(),
        source: 'coupon_modal',
        page: 'dashboard_aluno',
        section: 'payment_coming_soon_modal',
      });

      // Tracking do evento de sugestão (apenas após sucesso)
      trackEvent(trackingEvents.SUGGESTION_SENT, {
        user_type: 'student',
        page: 'dashboard_aluno',
        section: 'payment_coming_soon_modal',
        source: 'coupon_modal',
        suggestion_length: suggestion.trim().length,
        suggestion_id: savedSuggestion?.id || null,
      });
      
      // Tracking do evento de comentário (para o funil)
      if (suggestion && suggestion.trim() !== '') {
        await trackEvent(trackingEvents.CLASS_COMMENT_SENT, {
          user_type: 'student',
          page: 'dashboard_aluno',
          section: 'payment_coming_soon_modal',
          source: 'coupon_modal',
          suggestion_length: suggestion.trim().length,
          suggestion_id: savedSuggestion?.id || null,
          has_comment: true,
        });
      }
      
      setSuggestionSent(true);
      setSuggestion('');
      
      // Se houver uma aula associada, atualizar status e redirecionar
      if (classId && onComplete) {
        try {
          // Atualizar status da aula para concluída
          await studentsAPI.updateClassStatus(classId, 'concluida');
          console.log('✅ Aula atualizada para concluída:', classId);
          
          // Chamar callback para redirecionar e atualizar estado
          onComplete();
        } catch (error) {
          console.error('Erro ao atualizar status da aula:', error);
          // Continuar com o fechamento mesmo se houver erro
        }
      }
      
      // Fechar o modal após 1 segundo (tempo suficiente para mostrar a mensagem de sucesso)
      setTimeout(() => {
        handleClose(false); // Não completar novamente, já foi feito acima
      }, 1000);
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
      
      // Mensagem de erro mais específica
      let errorMessage = 'Erro ao enviar sugestão. Por favor, tente novamente.';
      
      if (error?.message) {
        if (error.message.includes('Sugestão não pode estar vazia')) {
          errorMessage = 'Por favor, digite uma sugestão antes de enviar.';
        } else if (error.message.includes('permission') || error.message.includes('RLS')) {
          errorMessage = 'Erro de permissão. Por favor, verifique se você está logado.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose(true); // Completar aula ao fechar pelo backdrop
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl max-w-xl sm:max-w-2xl w-full max-h-[95vh] sm:max-h-[85vh] md:max-h-fit shadow-2xl animate-slideUp flex flex-col mx-2 sm:mx-4 md:mx-0 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar - posição absoluta */}
        <button
          onClick={() => handleClose(true)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-full z-10"
          aria-label="Fechar"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="overflow-y-auto sm:overflow-y-visible flex-1 p-4 sm:p-5 md:p-6">
          <div className="space-y-4 sm:space-y-4 md:space-y-5">
            {/* Ícone e Mensagem Principal */}
            <div className="text-center pt-1 sm:pt-0 md:pt-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-primary/10 mb-3 sm:mb-3 md:mb-4">
                <svg 
                  className="h-6 w-6 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" 
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
              <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-1.5 md:mb-2 px-2">
                Estamos em fase de teste!
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2">
                A plataforma estará funcionando em breve.
              </p>
            </div>

            {!showCoupon ? (
              <>
                {/* Mensagem sobre o cupom */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-yellow-900 font-semibold mb-1 sm:mb-1.5 text-xs sm:text-sm md:text-base">
                        🎁 Ganhe um cupom de desconto!
                      </p>
                      <p className="text-yellow-800 text-xs sm:text-sm leading-relaxed">
                        Clique no botão abaixo para garantir seu <strong>cupom exclusivo</strong> quando a plataforma estiver funcionando. Você será um dos primeiros a ser notificado!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão de Cupom */}
                <button
                  onClick={handleGetCoupon}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Quero meu cupom
                </button>
              </>
            ) : (
              <>
                {/* Exibição do Cupom */}
                <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 border border-primary/30 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center">
                  <div className="mb-4 sm:mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-primary/20 mb-3 sm:mb-3 md:mb-4">
                      <svg 
                        className="h-6 w-6 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" 
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
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-2 px-2">
                      🎉 Parabéns! Seu cupom está aqui!
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                      Use este cupom quando a plataforma estiver funcionando para obter seu desconto exclusivo.
                    </p>
                  </div>
                  
                  {/* Código do Cupom */}
                  <div className="bg-white border-2 border-dashed border-primary/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-xs text-gray-500 mb-2 sm:mb-2.5 font-medium uppercase tracking-wide">Seu cupom exclusivo</p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                      <code className="text-sm sm:text-base md:text-lg font-bold text-primary tracking-wide text-center font-mono break-all">
                        USUARIODIAMANTE
                      </code>
                      <button
                        onClick={handleCopyCoupon}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        title="Copiar cupom"
                        aria-label="Copiar código do cupom"
                      >
                        {copied ? (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-2.5 font-medium">✓ Cupom copiado!</p>
                    )}
                  </div>
                </div>

                {/* Campo de Sugestões */}
                <div className="mt-4 sm:mt-4 md:mt-5 pt-4 sm:pt-4 md:pt-5 border-t border-gray-200">
                  <label htmlFor="suggestion" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    💡 Tem alguma sugestão para melhorarmos?
                  </label>
                  <textarea
                    id="suggestion"
                    value={suggestion}
                    onChange={(e) => {
                      setSuggestion(e.target.value);
                      setSubmitError('');
                    }}
                    placeholder="Compartilhe suas ideias e sugestões conosco..."
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-xs sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {submitError && (
                    <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {submitError}
                    </p>
                  )}
                  {suggestionSent && (
                    <p className="text-green-600 text-xs sm:text-sm mt-2 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Obrigado pela sua sugestão!
                    </p>
                  )}
                  {/* Botões lado a lado */}
                  <div className="flex gap-2 sm:gap-3 mt-3">
                    <button
                      onClick={handleSendSuggestion}
                      disabled={isSubmitting || !suggestion.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 sm:py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        'Enviar sugestão'
                      )}
                    </button>
                    <button
                      onClick={() => handleClose(true)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 sm:py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm md:text-base"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Botão de Fechar (quando não está mostrando o cupom) */}
            {!showCoupon && (
              <button
                onClick={() => handleClose(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 sm:py-2.5 md:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors mt-2 text-xs sm:text-sm md:text-base"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComingSoonModal;
