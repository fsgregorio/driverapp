import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../../../utils/dateUtils';
import { getClassTypeLabel, normalizeClassTypes, getClassTypeBadgeColor, formatLocation } from '../../../utils/classUtils';

const EvaluationModal = ({ isOpen, onClose, classData, onConfirm }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetar valores quando o modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação com estrelas.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onConfirm) {
        await onConfirm(classData.id, rating, comment);
      }
      handleClose();
    } catch (error) {
      console.error('Erro ao avaliar aula:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !classData) return null;

  const displayRating = hoveredRating || rating;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Avaliar Aula</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Informações da Aula */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={classData.instructorPhoto}
              alt={classData.instructorName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {classData.instructorName}
              </h3>
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
          
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDateTime(classData.date, classData.time)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate">{formatLocation(classData.location)}</span>
            </div>
          </div>
        </div>

        {/* Sistema de Estrelas */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Como foi sua experiência? <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => handleStarHover(value)}
                onMouseLeave={handleStarLeave}
                className={`transition-transform transform hover:scale-110 ${
                  isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
                disabled={isSubmitting}
                aria-label={`Avaliar com ${value} estrela${value > 1 ? 's' : ''}`}
              >
                <svg
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    value <= displayRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 1 && 'Péssimo'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </p>
          )}
        </div>

        {/* Campo de Comentário */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deixe um comentário sobre sua experiência com esta aula..."
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              'Enviar Avaliação'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
