import React from 'react';

const PopupSelector = ({ isOpen, onSelectProfile }) => {
  if (!isOpen) return null;

  const handleSelect = (profile) => {
    if (onSelectProfile) {
      onSelectProfile(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 max-w-2xl w-full mx-2 sm:mx-4 shadow-2xl animate-slideUp">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary text-center mb-4 sm:mb-6 md:mb-8 px-2">
          Como podemos te ajudar?
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <button
            onClick={() => handleSelect('student')}
            className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2 sm:gap-3"
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Sou Aluno</span>
          </button>
          
          <button
            onClick={() => handleSelect('instructor')}
            className="flex-1 bg-secondary hover:bg-gray-800 text-white font-semibold py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2 sm:gap-3"
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-center">Sou Instrutor Profissional</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupSelector;


