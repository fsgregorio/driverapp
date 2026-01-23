import React from 'react';
import Modal from '../../Modal';

const ScheduleConfirmationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitação Enviada!"
      hideFooter={true}
    >
      <div className="space-y-6">
        {/* Ícone e Mensagem Principal */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg 
              className="h-8 w-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Solicitação de agendamento concluída!
          </h3>
          <p className="text-gray-600">
            Fique atento! Assim que tiver o retorno do instrutor você será avisado para dar prosseguimento.
          </p>
        </div>

        {/* Botão de Fechar */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Entendi, obrigado!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleConfirmationModal;
