import React from 'react';
import Modal from '../../Modal';

const ComingSoonModal = ({ isOpen, onClose, scheduleData, instructor }) => {
  if (!isOpen) return null;

  // Formatar datas e horários para exibição
  const formatScheduleInfo = () => {
    if (!scheduleData || !scheduleData.dates) return null;

    const scheduleInfo = [];
    scheduleData.dates.forEach(dateOption => {
      if (dateOption.times && dateOption.times.length > 0) {
        const date = new Date(dateOption.date);
        const formattedDate = date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
        const times = dateOption.times.join(', ');
        scheduleInfo.push(`${formattedDate} às ${times}`);
      }
    });

    return scheduleInfo;
  };

  const scheduleInfo = formatScheduleInfo();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Em Breve!"
      hideFooter={true}
    >
      <div className="space-y-6">
        {/* Ícone e Mensagem Principal */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Estamos preparando tudo para você!
          </h3>
          <p className="text-gray-600">
            Obrigado pelo interesse! Estamos trabalhando para disponibilizar o agendamento de aulas em breve.
          </p>
        </div>

        {/* Informações do Agendamento Tentado */}
        {scheduleData && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">
              Detalhes do seu interesse:
            </h4>
            <div className="space-y-2 text-sm">
              {instructor && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 min-w-[100px]">Instrutor:</span>
                  <span className="text-gray-900 font-medium">{instructor.name}</span>
                </div>
              )}
              
              {scheduleInfo && scheduleInfo.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 min-w-[100px]">Horários:</span>
                  <div className="flex-1">
                    {scheduleInfo.map((info, index) => (
                      <div key={index} className="text-gray-900">{info}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {scheduleData.homeService && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 min-w-[100px]">Serviço:</span>
                  <span className="text-gray-900">Busca em casa</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mensagem Final */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <strong>Fique atento!</strong> Em breve entraremos em contato para confirmar sua aula e você será um dos primeiros a usar nossa plataforma.
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

export default ComingSoonModal;
