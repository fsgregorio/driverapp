import React from 'react';

const FavoriteInstructorModal = ({ isOpen, onClose, instructor, onConfirm }) => {
  if (!isOpen || !instructor) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(instructor);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Favoritar Instrutor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {(instructor.photo || instructor.instructorPhoto) ? (
              <img
                src={instructor.photo || instructor.instructorPhoto}
                alt={instructor.name || instructor.instructorName}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${(instructor.photo || instructor.instructorPhoto) ? 'hidden' : ''}`}>
              <svg className="w-9 h-9 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {instructor.name || instructor.instructorName}
              </h3>
              <p className="text-sm text-gray-600">
                Deseja adicionar este instrutor aos seus favoritos?
              </p>
            </div>
          </div>
          <p className="text-gray-700">
            Instrutores favoritos aparecem no topo da lista quando você busca por aulas e facilitam o agendamento futuro.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            Favoritar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteInstructorModal;
