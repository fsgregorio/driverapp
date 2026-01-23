import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../../../services/api';
import { sortByRelevance } from '../../../utils/sortUtils';

const InstructorsList = ({ onScheduleClass }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');

  // Load instructors from API
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (filterPrice === 'low') {
          filters.maxPrice = 120;
        } else if (filterPrice === 'medium') {
          filters.minPrice = 120;
          filters.maxPrice = 150;
        } else if (filterPrice === 'high') {
          filters.minPrice = 150;
        }
        const loadedInstructors = await studentsAPI.getInstructors(filters);
        // Log para debug: verificar valores de totalClasses
        if (loadedInstructors && loadedInstructors.length > 0) {
          console.log('📊 Total classes dos instrutores carregados:', loadedInstructors.map(i => ({
            name: i.name,
            totalClasses: i.totalClasses
          })));
        }
        setInstructors(loadedInstructors);
      } catch (error) {
        console.error('Error loading instructors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInstructors();
    
    // Recarregar quando a página ganha foco (útil para atualizar após mudanças no banco)
    const handleFocus = () => {
      console.log('🔄 Página ganhou foco, recarregando instrutores...');
      loadInstructors();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [filterPrice]);

  const filteredInstructors = instructors
    .filter(instructor => {
      const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (instructor.classTypes && instructor.classTypes.some(ct => ct.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesLocation = !filterLocation || instructor.location.includes(filterLocation);
      const matchesPrice = !filterPrice || (
        filterPrice === 'low' && instructor.pricePerClass < 120 ||
        filterPrice === 'medium' && instructor.pricePerClass >= 120 && instructor.pricePerClass < 150 ||
        filterPrice === 'high' && instructor.pricePerClass >= 150
      );
      return matchesSearch && matchesLocation && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'preco':
          return a.pricePerClass - b.pricePerClass;
        case 'avaliacao':
          return b.rating - a.rating;
        case 'relevancia':
        default:
          // Ordenar por relevância: premium primeiro, depois quantidade de aulas, depois avaliação
          return sortByRelevance(a, b);
      }
    });

  const handleSchedule = (instructor) => {
    if (onScheduleClass) {
      onScheduleClass(instructor);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome ou especialidade..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Localização
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">Todas</option>
              <option value="João Pessoa">João Pessoa</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="relevancia">Relevância</option>
              <option value="avaliacao">Avaliação</option>
              <option value="preco">Preço</option>
            </select>
          </div>
        </div>

        {/* Price Filter */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Faixa de Preço
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterPrice(filterPrice === 'low' ? '' : 'low')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                filterPrice === 'low'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Até R$ 120
            </button>
            <button
              onClick={() => setFilterPrice(filterPrice === 'medium' ? '' : 'medium')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                filterPrice === 'medium'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              R$ 120 - R$ 150
            </button>
            <button
              onClick={() => setFilterPrice(filterPrice === 'high' ? '' : 'high')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                filterPrice === 'high'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Acima de R$ 150
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        {filteredInstructors.length} instrutor(es) encontrado(s)
      </div>

      {/* Instructors Grid */}
      {loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">Carregando instrutores...</p>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">Nenhum instrutor encontrado</p>
          <p className="text-gray-500 mt-2">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
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
              
              {/* Badge Novo - Canto Superior Direito */}
              {instructor.totalClasses === 0 && (
                <span className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                  NOVO
                </span>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {instructor.photo ? (
                    <img
                      src={instructor.photo}
                      alt={instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${instructor.photo ? 'hidden' : ''}`}>
                    <svg className="w-9 h-9 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
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

              {/* Badges de Serviços e Veículos */}
              <div className="mb-3 flex flex-wrap gap-2">
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

              {/* Rating */}
              <div className="flex items-center mb-3">
                <span className="text-sm text-gray-600 mr-2">
                  {(() => {
                    const totalClasses = instructor.totalClasses || 0;
                    // Log para debug apenas no primeiro render de cada instrutor
                    if (process.env.NODE_ENV === 'development') {
                      console.log(`🎨 Renderizando ${instructor.name}: totalClasses = ${totalClasses}`);
                    }
                    return `${totalClasses} aulas dadas`;
                  })()}
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

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {instructor.description}
              </p>

              {/* Price and Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      R$ {instructor.pricePerClass}
                    </span>
                    <span className="text-sm text-gray-500">/aula</span>
                    <span className="text-xs text-gray-500 ml-2">(veículo do instrutor)</span>
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

export default InstructorsList;
