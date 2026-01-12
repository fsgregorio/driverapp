import React, { useState } from 'react';
import { mockInstructors } from '../../../utils/mockData';
import { sortByRelevance } from '../../../utils/sortUtils';

const InstructorsList = ({ onScheduleClass }) => {
  const [instructors] = useState(mockInstructors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');

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
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterPrice(filterPrice === 'low' ? '' : 'low')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterPrice === 'low'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Até R$ 120
            </button>
            <button
              onClick={() => setFilterPrice(filterPrice === 'medium' ? '' : 'medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterPrice === 'medium'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              R$ 120 - R$ 150
            </button>
            <button
              onClick={() => setFilterPrice(filterPrice === 'high' ? '' : 'high')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
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

export default InstructorsList;
