import React, { useState, useMemo, useEffect } from 'react';
import { mockInstructors } from '../../../utils/mockData';
import { sortByRelevance } from '../../../utils/sortUtils';
import { trackEvent, trackingEvents } from '../../../utils/trackingUtils';

const InstructorSearch = ({ onScheduleClass }) => {
  const [favoriteInstructorIds, setFavoriteInstructorIds] = useState([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
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
    // Ouvir mudanças no localStorage (de outras abas/janelas)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('favoriteInstructorsChanged', handleFavoriteChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const [filters, setFilters] = useState({
    name: '',
    classType: '',
    state: '',
    city: '',
    neighborhood: '',
    homeService: '',
    priceRange: '',
    sortBy: 'relevancia'
  });

  const [sliderValue, setSliderValue] = useState(200);

  // Tipos de aula fixos
  const classTypes = ['Rua', 'Baliza', 'Rodovia', 'Geral'];

  // Extrair valores únicos para os filtros
  const uniqueStates = useMemo(() => {
    const states = new Set(mockInstructors.map(inst => inst.location?.state).filter(Boolean));
    return Array.from(states).sort();
  }, []);

  const uniqueCities = useMemo(() => {
    if (!filters.state) return [];
    const cities = new Set(
      mockInstructors
        .filter(inst => inst.location?.state === filters.state)
        .map(inst => inst.location?.city)
        .filter(Boolean)
    );
    return Array.from(cities).sort();
  }, [filters.state]);

  const uniqueNeighborhoods = useMemo(() => {
    if (!filters.city) return [];
    const neighborhoods = new Set(
      mockInstructors
        .filter(inst => inst.location?.city === filters.city)
        .map(inst => inst.location?.neighborhood)
        .filter(Boolean)
    );
    return Array.from(neighborhoods).sort();
  }, [filters.city]);


  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset dependentes quando o filtro pai muda
      if (key === 'state') {
        newFilters.city = '';
        newFilters.neighborhood = '';
      }
      if (key === 'city') {
        newFilters.neighborhood = '';
      }
      
      return newFilters;
    });
  };

  const filteredInstructors = useMemo(() => {
    return mockInstructors
      .filter(instructor => {
        // Filtro por nome
        if (filters.name && !instructor.name.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }

        // Filtro por tipo de aula
        if (filters.classType) {
          if (filters.classType === 'Geral') {
            // Para "Geral", aceitar qualquer instrutor
            // Não precisa filtrar
          } else {
            // Verificar se o instrutor tem esse tipo de aula
            const hasClassType = instructor.classTypes?.includes(filters.classType);
            if (!hasClassType) {
              return false;
            }
          }
        }

        // Filtro por estado
        if (filters.state && instructor.location?.state !== filters.state) {
          return false;
        }

        // Filtro por cidade
        if (filters.city && instructor.location?.city !== filters.city) {
          return false;
        }

        // Filtro por bairro
        if (filters.neighborhood && instructor.location?.neighborhood !== filters.neighborhood) {
          return false;
        }

        // Filtro por busca em casa
        if (filters.homeService !== '') {
          const hasHomeService = instructor.homeService === true;
          if (filters.homeService === 'sim' && !hasHomeService) return false;
          if (filters.homeService === 'nao' && hasHomeService) return false;
        }

        // Filtro por faixa de preço
        if (filters.priceRange) {
          const price = instructor.pricePerClass;
          switch (filters.priceRange) {
            case '0-100':
              if (price > 100) return false;
              break;
            case '100-120':
              if (price < 100 || price > 120) return false;
              break;
            case '120-150':
              if (price < 120 || price > 150) return false;
              break;
            case '150-180':
              if (price < 150 || price > 180) return false;
              break;
            case '180+':
              if (price < 180) return false;
              break;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'preco_asc':
            return a.pricePerClass - b.pricePerClass;
          case 'preco_desc':
            return b.pricePerClass - a.pricePerClass;
          case 'avaliacao':
            return b.rating - a.rating;
          case 'nome':
            return a.name.localeCompare(b.name);
          case 'relevancia':
          default:
            // Ordenar por relevância: premium primeiro, depois quantidade de aulas, depois avaliação
            return sortByRelevance(a, b);
        }
      });
  }, [filters]);

  const handleSchedule = (instructor) => {
    // Tracking da visualização e tentativa de agendamento
    trackEvent(trackingEvents.DASHBOARD_ALUNO_INSTRUCTOR_VIEW, {
      instructor_id: instructor.id,
      instructor_name: instructor.name,
      instructor_premium: instructor.premium || false,
      instructor_rating: instructor.rating,
      instructor_price: instructor.pricePerClass,
      page: 'dashboard_aluno',
      section: 'instructor_search',
      action: 'schedule_click'
    });
    
    if (onScheduleClass) {
      onScheduleClass(instructor);
    }
  };

  // Tracking de busca quando filtros são aplicados
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'relevancia');
    if (hasActiveFilters) {
      trackEvent(trackingEvents.DASHBOARD_ALUNO_INSTRUCTOR_SEARCH, {
        filters_applied: filters,
        results_count: filteredInstructors.length,
        page: 'dashboard_aluno',
        section: 'instructor_search'
      });
    }
  }, [filters]);

  const handleToggleFavorite = (instructorId, e) => {
    e.stopPropagation();
    let newFavorites;
    if (favoriteInstructorIds.includes(instructorId)) {
      newFavorites = favoriteInstructorIds.filter(id => id !== instructorId);
    } else {
      newFavorites = [...favoriteInstructorIds, instructorId];
    }
    setFavoriteInstructorIds(newFavorites);
    localStorage.setItem('driveToPass_favoriteInstructors', JSON.stringify(newFavorites));
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('favoriteInstructorsChanged', { detail: newFavorites }));
  };

  const isFavorite = (instructorId) => {
    return favoriteInstructorIds.includes(instructorId);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      classType: '',
      state: '',
      city: '',
      neighborhood: '',
      homeService: '',
      priceRange: '',
      sortBy: 'relevancia'
    });
    setSliderValue(200);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-primary font-medium transition-colors"
          >
            Limpar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nome
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-accent"
            />
          </div>

          {/* Tipo de Aula */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Tipo de Aula
            </label>
            <select
              value={filters.classType}
              onChange={(e) => handleFilterChange('classType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white text-gray-700 hover:text-primary"
            >
              <option value="">Todos</option>
              {classTypes.map(type => (
                <option key={type} value={type} className="text-gray-700 hover:text-primary">{type}</option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Estado
            </label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white text-gray-700 hover:text-primary"
            >
              <option value="">Todos</option>
              {uniqueStates.map(state => (
                <option key={state} value={state} className="text-gray-700 hover:text-primary">{state}</option>
              ))}
            </select>
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Cidade
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              disabled={!filters.state}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white text-gray-700 hover:text-primary ${
                !filters.state ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''
              }`}
            >
              <option value="">Todas</option>
              {uniqueCities.map(city => (
                <option key={city} value={city} className="text-gray-700 hover:text-primary">{city}</option>
              ))}
            </select>
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Bairro
            </label>
            <select
              value={filters.neighborhood}
              onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
              disabled={!filters.city}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white text-gray-700 hover:text-primary ${
                !filters.city ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''
              }`}
            >
              <option value="">Todos</option>
              {uniqueNeighborhoods.map(neighborhood => (
                <option key={neighborhood} value={neighborhood} className="text-gray-700 hover:text-primary">{neighborhood}</option>
              ))}
            </select>
          </div>

          {/* Busca em Casa */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Busca em Casa
            </label>
            <select
              value={filters.homeService}
              onChange={(e) => handleFilterChange('homeService', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white text-gray-700 hover:text-primary"
            >
              <option value="">Todos</option>
              <option value="sim" className="text-gray-700 hover:text-primary">Sim</option>
              <option value="nao" className="text-gray-700 hover:text-primary">Não</option>
            </select>
          </div>
        </div>

        {/* Faixa de Preço - Slider */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-xs font-medium text-gray-600 mb-3">
            Faixa de Preço
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={sliderValue}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setSliderValue(value);
                let range = '';
                if (value === 200) {
                  range = '';
                } else if (value <= 100) {
                  range = '0-100';
                } else if (value <= 120) {
                  range = '100-120';
                } else if (value <= 150) {
                  range = '120-150';
                } else if (value <= 180) {
                  range = '150-180';
                } else {
                  range = '180+';
                }
                handleFilterChange('priceRange', range);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #2463EB 0%, #2463EB ${(sliderValue / 200) * 100}%, #E5E7EB ${(sliderValue / 200) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>R$ 0</span>
              <span className="font-medium text-primary">
                {sliderValue === 200 ? 'Todas' : 
                 sliderValue <= 100 ? `Até R$ ${sliderValue}` :
                 sliderValue <= 120 ? `R$ 100 - R$ ${sliderValue}` :
                 sliderValue <= 150 ? `R$ 120 - R$ ${sliderValue}` :
                 sliderValue <= 180 ? `R$ 150 - R$ ${sliderValue}` :
                 `Acima de R$ ${sliderValue}`}
              </span>
              <span>R$ 200+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados e Ordenação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="text-gray-600 text-sm sm:text-base">
          <strong>{filteredInstructors.length}</strong> instrutor(es) encontrado(s)
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
            Ordenar por:
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white text-gray-700 hover:text-primary"
          >
            <option value="relevancia">Relevância</option>
            <option value="avaliacao">Avaliação</option>
            <option value="preco_asc">Preço: Menor para Maior</option>
            <option value="preco_desc">Preço: Maior para Menor</option>
            <option value="nome">Nome (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid de Instrutores */}
      {filteredInstructors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">Nenhum instrutor encontrado</p>
          <p className="text-gray-500 mt-2">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative"
            >
              {/* Botão de Favoritar */}
              <button
                onClick={(e) => handleToggleFavorite(instructor.id, e)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title={isFavorite(instructor.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <svg 
                  className={`w-6 h-6 ${isFavorite(instructor.id) ? 'fill-current text-red-500' : ''}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>

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
              {instructor.homeService && (
                <div className="mb-4 flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Busca em casa</span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {instructor.description}
              </p>

              {/* Price and Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    R$ {instructor.pricePerClass}
                  </span>
                  <span className="text-sm text-gray-500">/aula</span>
                </div>
                <button
                  onClick={() => handleSchedule(instructor)}
                  className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
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

export default InstructorSearch;
