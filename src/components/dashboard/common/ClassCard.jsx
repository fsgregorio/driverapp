import React from 'react';
import { getClassTypeLabel, normalizeClassTypes, getClassTypeBadgeColor } from '../../../utils/classUtils';

const ClassCard = ({ 
  classData, 
  userType, 
  onCancel, 
  onConfirm, 
  onReject,
  onReschedule 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'em andamento': 'bg-purple-100 text-purple-800',
      'concluída': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
      'agendada': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {userType === 'student' ? (
            <>
              <img
                src={classData.instructorPhoto}
                alt={classData.instructorName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{classData.instructorName}</h3>
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
            </>
          ) : (
            <>
              <img
                src={classData.studentPhoto}
                alt={classData.studentName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{classData.studentName}</h3>
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
            </>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(classData.status)}`}>
          {classData.status.charAt(0).toUpperCase() + classData.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">{formatDate(classData.date)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{classData.time} - {classData.duration}min</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{classData.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-sm font-medium">{classData.car || 'Não informado'}</span>
        </div>
        <div className="flex items-center text-gray-900 font-semibold">
          <span>R$ {classData.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Avaliação (se concluída e tiver avaliação) */}
      {(classData.status === 'concluída' || classData.status === 'concluida') && classData.rating && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Avaliação</h4>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.floor(classData.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">{classData.rating}/5</span>
          </div>
          {classData.review && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">"{classData.review}"</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {classData.status === 'pendente' && userType === 'instructor' && (
          <>
            <button
              onClick={() => onConfirm(classData.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={() => onReject(classData.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Rejeitar
            </button>
          </>
        )}
        {(classData.status === 'confirmada' || classData.status === 'agendada') && (
          <>
            {onCancel && (
              <button
                onClick={() => onCancel(classData.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
            {onReschedule && (
              <button
                onClick={() => onReschedule(classData.id)}
                className="flex-1 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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

export default ClassCard;
