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
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleRemoveFavorite(instructor.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Remover dos favoritos"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </button>
              </div>

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
                      {instructor.location?.neighborhood && instructor.location?.city && instructor.location?.state
                        ? `${instructor.location.neighborhood} - ${instructor.location.city}/${instructor.location.state}`
                        : instructor.location?.city && instructor.location?.state
                        ? `${instructor.location.city}/${instructor.location.state}`
                        : instructor.location?.fullAddress || 'Localização não informada'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge Premium e Tipos de Aula */}
              <div className="mb-3">
                {instructor.premium && (
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold rounded-full mb-2">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    PREMIUM
                  </span>
                )}
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

              {/* Info adicional */}
              <div className="mb-4 space-y-1 text-sm text-gray-600">
                {instructor.homeService && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Busca em casa</span>
                  </div>
                )}
                {instructor.carTypes && instructor.carTypes.length > 0 && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span>{instructor.carTypes.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {instructor.description}
              </p>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    R$ {instructor.pricePerClass}
                  </span>
                  <span className="text-sm text-gray-500">/aula</span>
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
