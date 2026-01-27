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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow">
      {/* Header com Instrutor e Status */}
      <div className="mb-3 sm:mb-4">
        {/* Nome do Instrutor e Status - Layout vertical em mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            {classData.instructorPhoto ? (
              <img
                src={classData.instructorPhoto}
                alt={classData.instructorName}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ${classData.instructorPhoto ? 'hidden' : ''}`}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">{classData.instructorName}</h3>
                  {/* Ícone de favoritar - aparece apenas no histórico (aulas concluídas) */}
                  {classData.status === 'concluida' && onFavoriteInstructor && (
                    <button
                      onClick={() => onFavoriteInstructor(classData)}
                      className={`transition-colors p-1 flex-shrink-0 ${
                        isFavorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={isFavorite ? "Instrutor favorito" : "Favoritar instrutor"}
                      aria-label={isFavorite ? "Instrutor favorito" : "Favoritar instrutor"}
                    >
                      {isFavorite ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                {/* Status badge - aparece ao lado do nome em mobile, acima em desktop */}
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 self-start ${getStatusColor(classData.status)}`}>
                  {getStatusLabel(classData.status)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
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
        </div>
      </div>

      {/* Informações da Aula */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {/* Data e Hora */}
        <div className="flex items-start sm:items-center text-gray-700">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {classData.status === 'pendente_aceite' && classData.availableOptions ? (
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm sm:text-base">Opções de horários selecionadas:</span>
              <div className="mt-2 space-y-2">
                {classData.availableOptions.map((option, idx) => (
                  <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <div className="font-semibold text-xs sm:text-sm text-gray-800">
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
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm sm:text-base break-words">{formatDateTime(classData.date, classData.time)}</span>
              <span className="ml-2 text-gray-500 text-sm">({classData.duration}min)</span>
            </div>
          )}
        </div>

        {/* Localização Detalhada */}
        <div className="flex items-start text-gray-700">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            {locationParts ? (
              <div>
                <p className="font-medium text-sm sm:text-base break-words">{locationParts.address || ''}</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">
                  {locationParts.neighborhood && typeof locationParts.neighborhood === 'string' ? `${locationParts.neighborhood}, ` : ''}
                  {typeof locationParts.city === 'string' ? locationParts.city : ''}
                  {typeof locationParts.city === 'string' && typeof locationParts.state === 'string' ? ' - ' : ''}
                  {typeof locationParts.state === 'string' ? locationParts.state : ''}
                </p>
              </div>
            ) : (
              <p className="text-sm sm:text-base break-words">{location}</p>
            )}
          </div>
        </div>

        {/* Badge de Pickup Type */}
        {classData.pickupType && (
          <div className="flex items-center">
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getPickupBadgeColor(classData.pickupType)}`}>
              {getPickupTypeLabel(classData.pickupType)}
            </span>
          </div>
        )}

        {/* Carro */}
        <div className="flex items-center text-gray-700">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-xs sm:text-sm font-medium break-words">{classData.car || 'Não informado'}</span>
        </div>

        {/* Valor */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 pt-2 border-t border-gray-200">
          <span className="text-xs sm:text-sm text-gray-600">Valor da aula:</span>
          <span className="text-lg sm:text-xl font-bold text-primary">R$ {classData.price.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Avaliação (se concluída e tiver avaliação) */}
      {classData.status === 'concluida' && (() => {
        // Converter rating para número se necessário
        const rating = classData.rating != null ? parseInt(classData.rating) : null;
        const hasRating = rating != null && !isNaN(rating) && rating > 0;
        const hasReview = classData.review && typeof classData.review === 'string' && classData.review.trim() !== '';
        
        if (!hasRating && !hasReview) return null;
        
        return (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Sua Avaliação
            </h4>
            {hasRating && (
              <div className="flex items-center mb-3">
                <div className="flex items-center text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-gray-300 fill-gray-300'}`} 
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm font-semibold text-gray-800">{rating}/5</span>
              </div>
            )}
            {hasReview && (
              <div className={hasRating ? 'mt-3 pt-3 border-t border-yellow-300' : ''}>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{classData.review.trim()}"</p>
              </div>
            )}
          </div>
        );
      })()}

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
