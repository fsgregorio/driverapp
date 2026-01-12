import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, hideFooter = false }) => {
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

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-slideUp flex flex-col mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary pr-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

