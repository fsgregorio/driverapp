import React from 'react';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';
import { formatLocation, getPickupTypeLabel, getClassTypeLabel, normalizeClassTypes, getClassTypeBadgeColor } from '../../../utils/classUtils';

const ClassCardEnhanced = ({ 
  classData, 
  onCancel, 
  onReschedule,
  onPay,
  onEvaluate,
  onFavoriteInstructor,
  isFavorite = false
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'pendente_aceite': 'bg-yellow-100 text-yellow-800',
      'pendente_pagamento': 'bg-blue-100 text-blue-800',
      'pendente_avaliacao': 'bg-green-100 text-green-800',
      'agendada': 'bg-blue-100 text-blue-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'em andamento': 'bg-purple-100 text-purple-800',
      'concluida': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pendente_aceite': 'Aguardando Aceite',
      'pendente_pagamento': 'Aguardando Pagamento',
      'pendente_avaliacao': 'Aguardando Avaliação',
      'agendada': 'Agendada',
      'confirmada': 'Agendada',
      'em andamento': 'Em Andamento',
      'concluida': 'Concluída',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  };

  const getPickupBadgeColor = (pickupType) => {
    return pickupType === 'vai_local' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  const location = formatLocation(classData.location);
  const locationParts = classData.location && typeof classData.location === 'object' 
    ? classData.location 
    : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header com Instrutor e Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {classData.instructorPhoto ? (
            <img
              src={classData.instructorPhoto}
              alt={classData.instructorName}
              className="w-14 h-14 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center ${classData.instructorPhoto ? 'hidden' : ''}`}>
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg text-gray-900">{classData.instructorName}</h3>
              {/* Ícone de favoritar - aparece apenas no histórico (aulas concluídas) */}
              {classData.status === 'concluida' && onFavoriteInstructor && (
                <button
                  onClick={() => onFavoriteInstructor(classData)}
                  className={`transition-colors p-1 ${
                    isFavorite 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={isFavorite ? "Instrutor favorito" : "Favoritar instrutor"}
                  aria-label={isFavorite ? "Instrutor favorito" : "Favoritar instrutor"}
                >
                  {isFavorite ? (
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {normalizeClassTypes(classData.type).map((type, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getClassTypeBadgeColor(type)}`}
                >
                  {getClassTypeLabel(type)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(classData.status)}`}>
          {getStatusLabel(classData.status)}
        </span>
      </div>

      {/* Informações da Aula */}
      <div className="space-y-3 mb-4">
        {/* Data e Hora */}
        <div className="flex items-center text-gray-700">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {classData.status === 'pendente_aceite' && classData.availableOptions ? (
            <div className="flex-1">
              <span className="font-medium">Opções de horários selecionadas:</span>
              <div className="mt-2 space-y-2">
                {classData.availableOptions.map((option, idx) => (
                  <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <div className="font-semibold text-sm text-gray-800">
                      {formatDate(option.date)}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {option.times.map((time, timeIdx) => (
                        <span key={timeIdx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                O instrutor escolherá o melhor horário entre essas opções
              </p>
            </div>
          ) : (
            <>
              <span className="font-medium">{formatDateTime(classData.date, classData.time)}</span>
              <span className="ml-2 text-gray-500">({classData.duration}min)</span>
            </>
          )}
        </div>

        {/* Localização Detalhada */}
        <div className="flex items-start text-gray-700">
          <svg className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            {locationParts ? (
              <div>
                <p className="font-medium">{locationParts.address}</p>
                <p className="text-sm text-gray-600">
                  {locationParts.neighborhood && `${locationParts.neighborhood}, `}
                  {locationParts.city} - {locationParts.state}
                </p>
              </div>
            ) : (
              <p>{location}</p>
            )}
          </div>
        </div>

        {/* Badge de Pickup Type */}
        {classData.pickupType && (
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPickupBadgeColor(classData.pickupType)}`}>
              {getPickupTypeLabel(classData.pickupType)}
            </span>
          </div>
        )}

        {/* Carro */}
        <div className="flex items-center text-gray-700">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-sm font-medium">{classData.car || 'Não informado'}</span>
        </div>

        {/* Valor */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Valor da aula:</span>
          <span className="text-xl font-bold text-primary">R$ {classData.price.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Avaliação (se concluída e tiver avaliação) */}
      {classData.status === 'concluida' && (classData.rating != null || (classData.review && classData.review.trim() !== '')) && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Sua Avaliação</h4>
          {classData.rating != null && classData.rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(classData.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{classData.rating}/5</span>
            </div>
          )}
          {classData.review && classData.review.trim() !== '' && (
            <div className={`${classData.rating != null && classData.rating > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
              <p className="text-sm text-gray-700 leading-relaxed">"{classData.review}"</p>
            </div>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-4 border-t border-gray-200">
        {/* Botões Pagar e Cancelar - aparecem quando status é pendente_pagamento */}
        {classData.status === 'pendente_pagamento' && (
          <>
            {onPay && (
              <button
                onClick={() => onPay(classData.id)}
                className="w-full sm:flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Pagar
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(classData.id)}
                className="w-full sm:flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
          </>
        )}

        {/* Botão Avaliar - aparece quando status é pendente_avaliacao */}
        {classData.status === 'pendente_avaliacao' && onEvaluate && (
          <button
            onClick={() => onEvaluate(classData.id)}
            className="w-full sm:flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Avaliar Aula
          </button>
        )}

        {/* Botão Cancelar - aparece para pendente_aceite */}
        {classData.status === 'pendente_aceite' && onCancel && (
          <button
            onClick={() => onCancel(classData.id)}
            className="w-full sm:flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
        )}

        {/* Botões Cancelar e Reagendar - aparecem quando status é agendada ou confirmada */}
        {(classData.status === 'agendada' || classData.status === 'confirmada') && (
          <>
            {onCancel && (
              <button
                onClick={() => onCancel(classData.id)}
                className="w-full sm:flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
            {onReschedule && (
              <button
                onClick={() => onReschedule(classData.id)}
                className="w-full sm:flex-1 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Reagendar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClassCardEnhanced;
