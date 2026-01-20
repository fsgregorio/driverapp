import React, { useState, useEffect } from 'react';
import { mockInstructors } from '../../../utils/mockData';

const FavoriteInstructors = ({ onScheduleClass, onNavigateToSearch }) => {
  const [favoriteInstructorIds, setFavoriteInstructorIds] = useState([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem('driveToPass_favoriteInstructors');
    if (savedFavorites) {
      setFavoriteInstructorIds(JSON.parse(savedFavorites));
    } else {
      // Mock: alguns instrutores favoritos padrão
      const defaultFavorites = [1, 2];
      setFavoriteInstructorIds(defaultFavorites);
      localStorage.setItem('driveToPass_favoriteInstructors', JSON.stringify(defaultFavorites));
    }
  }, []);

  const favoriteInstructors = mockInstructors.filter(inst => 
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Instrutores Favoritos</h2>
          <p className="text-gray-600 mt-1">
            Seus instrutores favoritos para facilitar o agendamento
          </p>
        </div>
        <button
          onClick={handleAddFavorite}
          className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Favorito
        </button>
      </div>

      {/* Lista de Favoritos */}
      {favoriteInstructors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-2">Nenhum instrutor favorito ainda</p>
          <p className="text-gray-500 mb-4">Adicione instrutores aos seus favoritos para facilitar o agendamento</p>
          <button
            onClick={handleAddFavorite}
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Buscar Instrutores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative"
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

              <div className="flex items-start justify-between mb-4 pr-8">
                <div className="flex items-center space-x-3">
                  <img
                    src={instructor.photo}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{instructor.name}</h3>
                    <p className="text-sm text-gray-500">
                      {instructor.location?.neighborhood || 'Bairro não informado'}
                    </p>
                    {instructor.vehicle && (
                      <p className="text-sm text-gray-700 font-medium mt-1">
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
              <div className="flex items-center mb-3">
                <span className="text-sm text-gray-600 mr-2">
                  {instructor.totalClasses || 0} aulas dadas
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(instructor.rating) ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {instructor.rating} ({instructor.totalReviews} avaliações)
                </span>
              </div>

              {/* Badges de Serviços e Veículos */}
              <div className="mb-4 flex flex-wrap gap-2">
                {/* Badge Veículo do Instrutor */}
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Veículo do Instrutor
                </span>
                
                {/* Badge Veículo Próprio */}
                {instructor.offersOwnVehicle !== false && instructor.priceOwnVehicle && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    Veículo Próprio
                  </span>
                )}
                
                {/* Badge Busca em Casa */}
                {instructor.homeService && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Busca em Casa
                  </span>
                )}
                
                {/* Badge Aulas somente para mulheres */}
                {instructor.womenOnly && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-lg">
                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Aulas somente para mulheres
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {instructor.description}
              </p>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="text-2xl font-bold text-primary">
                      R$ {instructor.pricePerClass}
                    </span>
                    <span className="text-sm text-gray-500">/aula</span>
                    <span className="text-xs text-gray-500 ml-2">(veículo do instrutor)</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSchedule(instructor)}
                  className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Agendar
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-3 text-xs text-gray-500">
                <p>{instructor.responseTime}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default FavoriteInstructors;
