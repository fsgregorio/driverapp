import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../../../services/api';
import InstructorReviewsModal from './InstructorReviewsModal';

const FavoriteInstructors = ({ onScheduleClass, onNavigateToSearch }) => {
  const [favoriteInstructorIds, setFavoriteInstructorIds] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Carregar todos os instrutores da API
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        setLoading(true);
        const data = await studentsAPI.getInstructors();
        setAllInstructors(data || []);
      } catch (error) {
        console.error('Error loading instructors:', error);
        setAllInstructors([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadInstructors();
  }, []);

  // Carregar favoritos do localStorage e escutar mudanças
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('driveToPass_favoriteInstructors');
      if (savedFavorites) {
        setFavoriteInstructorIds(JSON.parse(savedFavorites));
      } else {
        setFavoriteInstructorIds([]);
      }
    };
    
    loadFavorites();
    
    // Ouvir mudanças no localStorage de outros componentes
    const handleStorageChange = (e) => {
      if (e.key === 'driveToPass_favoriteInstructors' || !e.key) {
        loadFavorites();
      }
    };
    
    // Ouvir evento customizado
    const handleFavoriteChange = (e) => {
      setFavoriteInstructorIds(e.detail);
    };
    
    window.addEventListener('favoriteInstructorsChanged', handleFavoriteChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('favoriteInstructorsChanged', handleFavoriteChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filtrar instrutores favoritos dos instrutores carregados da API
  const favoriteInstructors = allInstructors.filter(inst => 
    favoriteInstructorIds.includes(inst.id)
  );

  const handleRemoveFavorite = (instructorId) => {
    const newFavorites = favoriteInstructorIds.filter(id => id !== instructorId);
    setFavoriteInstructorIds(newFavorites);
    localStorage.setItem('driveToPass_favoriteInstructors', JSON.stringify(newFavorites));
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('favoriteInstructorsChanged', { detail: newFavorites }));
  };

  const handleAddFavorite = () => {
    if (onNavigateToSearch) {
      onNavigateToSearch();
    }
  };

  const handleSchedule = (instructor) => {
    if (onScheduleClass) {
      onScheduleClass(instructor);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Favoritos</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Seus instrutores favoritos para facilitar o agendamento
        </p>
      </div>

      {/* Lista de Favoritos */}
      {loading ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-base sm:text-lg">Carregando instrutores favoritos...</p>
        </div>
      ) : favoriteInstructors.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl px-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-600 text-base sm:text-lg mb-2">Nenhum instrutor favorito ainda</p>
          <p className="text-sm sm:text-base text-gray-500 mb-4">Adicione instrutores aos seus favoritos para facilitar o agendamento</p>
          <button
            onClick={handleAddFavorite}
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 sm:py-2 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            Buscar Instrutores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {favoriteInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow relative"
            >
              {/* Badge de Favorito */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                <button
                  onClick={() => handleRemoveFavorite(instructor.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Remover dos favoritos"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </button>
              </div>
              
              {/* Badge Premium - Temporariamente desativado */}
              {/* {instructor.premium && (
                <span className={`absolute top-2 sm:top-4 ${instructor.totalClasses === 0 ? 'right-20 sm:right-28' : 'right-12 sm:right-16'} z-20 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-[10px] sm:text-xs font-bold rounded-full shadow-lg`}>
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="hidden sm:inline">PREMIUM</span>
                  <span className="sm:hidden">⭐</span>
                </span>
              )} */}
              
              {/* Badge Novo - Antes do botão de favorito */}
              {instructor.totalClasses === 0 && (
                <span className="absolute top-2 sm:top-4 right-12 sm:right-16 z-20 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                  NOVO
                </span>
              )}

              <div className="flex items-start justify-between mb-3 sm:mb-4 pr-6 sm:pr-8">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <img
                    src={instructor.photo}
                    alt={instructor.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{instructor.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {instructor.location?.neighborhood || 'Bairro não informado'}
                    </p>
                    {instructor.vehicle && (
                      <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1 truncate">
                        🚗 {instructor.vehicle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tipos de Aula */}
              <div className="mb-3">
                {instructor.classTypes && instructor.classTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {instructor.classTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-accent text-primary text-xs font-semibold rounded-lg"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {instructor.totalClasses || 0} aulas dadas
                  </span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(instructor.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {instructor.rating || 0} ({instructor.totalReviews || 0} avaliações)
                  </span>
                </div>
                {instructor.totalReviews > 0 && (
                  <button
                    onClick={() => {
                      setSelectedInstructor(instructor);
                      setShowReviewsModal(true);
                    }}
                    className="text-primary hover:text-blue-600 text-xs sm:text-sm font-medium transition-colors flex items-center self-start sm:self-auto"
                  >
                    Ver comentários
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Badges de Serviços e Veículos */}
              <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
                {/* Badge Veículo do Instrutor */}
                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-lg">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span className="truncate">Veículo do Instrutor</span>
                </span>
                
                {/* Badge Veículo Próprio */}
                {instructor.offersOwnVehicle !== false && instructor.priceOwnVehicle && (
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold rounded-lg">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span className="truncate">Veículo Próprio</span>
                  </span>
                )}
                
                {/* Badge Busca em Casa */}
                {instructor.homeService && (
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-semibold rounded-lg">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="truncate">Busca em Casa</span>
                  </span>
                )}
                
                {/* Badge Aulas somente para mulheres */}
                {instructor.womenOnly && (
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-pink-100 text-pink-700 text-[10px] sm:text-xs font-semibold rounded-lg">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">Aulas somente para mulheres</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                {instructor.description}
              </p>

              {/* Price and Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      R$ {instructor.pricePerClass}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">/aula</span>
                    <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2">(veículo do instrutor)</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSchedule(instructor)}
                  className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Agendar
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                <p>{instructor.responseTime}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Avaliações */}
      <InstructorReviewsModal
        isOpen={showReviewsModal}
        onClose={() => {
          setShowReviewsModal(false);
          setSelectedInstructor(null);
        }}
        instructor={selectedInstructor}
      />
    </div>
  );
};

export default FavoriteInstructors;
